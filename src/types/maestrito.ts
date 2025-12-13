export type MaestritoResponseType =
	| 'MESSAGE'
	| 'WAITING_INPUT'
	| 'ERROR'
	| 'SOLICITUD_CREATED';

export interface MaestritoSolicitudSummary {
	idSolicitud: number;
	[key: string]: unknown;
}

export interface MaestritoResponse {
	sessionId: string;
	type: MaestritoResponseType;
	message: string;
	missingFields?: string[];
	solicitud?: MaestritoSolicitudSummary | null;
	timestamp: string | Date;
}

export type ChatAuthor = 'user' | 'assistant' | 'system';

export interface ChatMessage {
	role: ChatAuthor;
	content: string;
	timestamp?: string | Date;
}

export type MaestritoChatAuthor = 'user' | 'maestrito';

export interface MaestritoChatMessage {
	id: string;
	author: MaestritoChatAuthor;
	text: string;
	createdAt: string;
	responseType?: MaestritoResponseType;
	missingFields?: string[];
	solicitudId?: number;
}