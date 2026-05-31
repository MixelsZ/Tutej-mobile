import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import Button from './Button';

interface FormModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitText: string;
  children: React.ReactNode;
}

export default function FormModal({
  title,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  submitText,
  children,
}: FormModalProps) {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text style={styles.arrow}>{"<"}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>

          <ScrollView
            style={styles.modalBody}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              text={isSubmitting ? 'Przetwarzanie...' : submitText}
              variant="primary"
              onClick={onSubmit}
              disabled={isSubmitting}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  modalHeader: {
    padding: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    backgroundColor: '#F5F5F5',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  arrow: {
    fontSize: 20,
    color: '#333',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  modalBody: {
    padding: 24,
  },
  modalFooter: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
});