import { useCallback, useEffect, useRef, useState } from 'react';
import { maestritoService } from '../../../services/maestrito.service';
import {
  ChatMessage,
  MaestritoChatMessage,
  MaestritoResponse,
  MaestritoResponseType,
} from '../../../types/maestrito';
import { ErrorUtils } from '../../../utils/error.utils';

const ASSISTANT_ROLE = 'assistant';
const USER_ROLE = 'user';

const createMessageId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const toIsoString = (value?: string | Date): string => {
  if (!value) {
    return new Date().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }

  return new Date().toISOString();
};

const sanitizeLLMOutput = (value: string): string =>
  value.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

const extractJsonPayload = (value: string): any | null => {
  const matches = value.match(/\{[\s\S]*?\}/g) ?? [];
  let selected = '';

  matches.forEach(candidate => {
    if (candidate.length > selected.length) {
      try {
        JSON.parse(candidate);
        selected = candidate;
      } catch {
        // ignore invalid entries
      }
    }
  });

  if (!selected) {
    return null;
  }

  try {
    return JSON.parse(selected);
  } catch {
    return null;
  }
};

const ensureAssistantDisplayText = (value: string): string => {
  const cleaned = sanitizeLLMOutput(String(value ?? ''));
  const payload = extractJsonPayload(cleaned);

  if (payload && typeof payload === 'object' && typeof payload.content === 'string') {
    return payload.content.trim();
  }

  if (/^\s*\{/.test(cleaned) || /"mode"\s*:/.test(cleaned)) {
    return 'Estoy procesando la información. Confírmame si deseas continuar o indícame qué dato quieres ajustar.';
  }

  return cleaned;
};

const mapModeToResponseType = (mode?: string): MaestritoResponseType | undefined => {
  if (!mode) {
    return undefined;
  }

  if (mode === 'CREAR_SOLICITUD') {
    return 'SOLICITUD_CREATED';
  }

  if (mode === 'MENSAJE') {
    return 'MESSAGE';
  }

  return undefined;
};

const parseAssistantHistory = (
  content: string,
): Pick<MaestritoChatMessage, 'text' | 'responseType'> & {
  missingFields?: string[];
} => {
  const cleaned = sanitizeLLMOutput(content);
  const payload = extractJsonPayload(cleaned);

  if (payload && typeof payload === 'object' && 'content' in payload) {
    const responseType = mapModeToResponseType(payload.mode);
    const missingFields =
      Array.isArray(payload.missingFields) && payload.missingFields.length > 0
        ? (payload.missingFields as string[])
        : undefined;

    return {
      text: String(payload.content ?? ''),
      responseType,
      missingFields,
    };
  }

  return {
    text: content,
    responseType: undefined,
  };
};

const mapHistoryMessages = (items: ChatMessage[]): MaestritoChatMessage[] => {
  return items
    .filter(item => item.role === USER_ROLE || item.role === ASSISTANT_ROLE)
    .map((item, index) => {
      if (item.role === USER_ROLE) {
        return {
          id: createMessageId(`history-user-${index}`),
          author: 'user' as const,
          text: item.content,
          createdAt: toIsoString(item.timestamp),
        };
      }

      const assistantDetails = parseAssistantHistory(item.content);

      return {
        id: createMessageId(`history-assistant-${index}`),
        author: 'maestrito' as const,
        text: assistantDetails.text,
        createdAt: toIsoString(item.timestamp),
        responseType: assistantDetails.responseType,
        missingFields: assistantDetails.missingFields,
      };
    });
};

const mapResponseToChatMessage = (
  response: MaestritoResponse,
): MaestritoChatMessage => {
  const solicitudId =
    response.solicitud && typeof response.solicitud === 'object' && 'idSolicitud' in response.solicitud
      ? Number((response.solicitud as Record<string, unknown>).idSolicitud)
      : undefined;

  return {
    id: createMessageId('assistant'),
    author: 'maestrito',
    text: ensureAssistantDisplayText(response.message),
    createdAt: toIsoString(response.timestamp),
    responseType: response.type,
    missingFields: response.missingFields,
    solicitudId: Number.isFinite(solicitudId) ? solicitudId : undefined,
  };
};

export interface UseMaestritoChatResult {
  sessionId: string | null;
  loading: boolean;
  sending: boolean;
  typing: boolean;
  messages: MaestritoChatMessage[];
  error: string | null;
  maestritoError: string | null;
  isCompleted: boolean;
  createdSolicitudId: number | null;
  sendMessage: (text: string) => Promise<void>;
  retry: () => Promise<void>;
  endChat: () => Promise<void>;
}

export function useMaestritoChat(): UseMaestritoChatResult {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MaestritoChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);
  const [typing, setTyping] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [maestritoError, setMaestritoError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [createdSolicitudId, setCreatedSolicitudId] = useState<number | null>(null);

  const sessionRef = useRef<string | null>(null);
  const mountedRef = useRef<boolean>(false);

  const startSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMaestritoError(null);
    setMessages([]);
    setIsCompleted(false);
    setCreatedSolicitudId(null);

    try {
      const { sessionId: newSessionId } = await maestritoService.startSession();

      if (!mountedRef.current) {
        return;
      }

      sessionRef.current = newSessionId;
      setSessionId(newSessionId);

      try {
        const history = await maestritoService.getHistory(newSessionId);
        if (mountedRef.current && history?.messages) {
          setMessages(mapHistoryMessages(history.messages));
        }
      } catch (historyError) {
        console.warn('[useMaestritoChat] History fetch failed', historyError);
      }
    } catch (err) {
      const message = ErrorUtils.getErrorMessage(err);
      if (mountedRef.current) {
        setError(message);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const endChat = useCallback(async () => {
    const currentSession = sessionRef.current;

    if (!currentSession) {
      return;
    }

    try {
      await maestritoService.endSession(currentSession);
    } catch (err) {
      console.warn('[useMaestritoChat] Failed to end session', err);
    } finally {
      if (mountedRef.current) {
        sessionRef.current = null;
        setSessionId(null);
      }
    }
  }, []);

  const retry = useCallback(async () => {
    if (!mountedRef.current) {
      return;
    }

    sessionRef.current = null;
    setSessionId(null);
    setMessages([]);
    setIsCompleted(false);
    setCreatedSolicitudId(null);
    setMaestritoError(null);
    setError(null);

    await startSession();
  }, [startSession]);

  const sendMessage = useCallback(
    async (text: string) => {
      const message = text.trim();

      if (!message || sending || !sessionRef.current || isCompleted) {
        return;
      }

      const userMessage: MaestritoChatMessage = {
        id: createMessageId('user'),
        author: 'user',
        text: message,
        createdAt: toIsoString(),
      };

      setMessages(prev => [...prev, userMessage]);
      setSending(true);
      setTyping(true);
      setError(null);
      setMaestritoError(null);

      try {
        const response = await maestritoService.sendMessage(sessionRef.current, message);

        if (!mountedRef.current) {
          return;
        }

        const assistantMessage = mapResponseToChatMessage(response);
        setMessages(prev => [...prev, assistantMessage]);

        if (response.type === 'SOLICITUD_CREATED') {
          setIsCompleted(true);
          if (assistantMessage.solicitudId != null) {
            setCreatedSolicitudId(assistantMessage.solicitudId);
          }
          void endChat();
        }

        if (response.type === 'ERROR') {
          setMaestritoError(response.message);
        }
      } catch (err) {
        const messageError = ErrorUtils.getErrorMessage(err);
        if (mountedRef.current) {
          const normalized = messageError.toLowerCase();
          const isTimeout =
            normalized.includes('econnaborted') ||
            normalized.includes('timeout') ||
            normalized.includes('network error');

          if (isTimeout) {
            setError(null);
            setMaestritoError('Maestrito está tardando un poco más de lo habitual. Puedes esperar unos segundos o intentarlo de nuevo.');
          } else {
            setError(messageError);
          }
        }
      } finally {
        if (mountedRef.current) {
          setSending(false);
          setTyping(false);
        }
      }
    },
    [sending, isCompleted, endChat],
  );

  useEffect(() => {
    mountedRef.current = true;
    startSession();

    return () => {
      mountedRef.current = false;
      sessionRef.current = null;
    };
  }, [startSession]);

  return {
    sessionId,
    loading,
    sending,
    typing,
    messages,
    error,
    maestritoError,
    isCompleted,
    createdSolicitudId,
    sendMessage,
    retry,
    endChat,
  };
}
