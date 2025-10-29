import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { GenericModalProps } from '../interface';

export const GenericModal: React.FC<GenericModalProps> = ({
    isOpen,
    onClose,
    title,
    content,
    footer,
    animationType = 'fade'
}) => {
    if (!isOpen) return null;

    return (
        <Modal visible={isOpen} animationType={animationType} transparent>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 20, width: '90%' }}>
                    {title && <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>{title}</Text>}
                    {content}
                    {footer}
                    <TouchableOpacity onPress={onClose} style={{ marginTop: 10 }}>
                        <Text style={{ textAlign: 'center' }}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};
