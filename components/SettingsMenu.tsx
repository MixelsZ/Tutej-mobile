import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';

export function SettingsMenu({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    return (
        <Modal transparent visible={isOpen} animationType="fade" onRequestClose={onClose}>
            {/* Tło zamykające menu po kliknięciu poza */}
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={styles.menu}>
                    <TouchableOpacity style={styles.item} onPress={() => { /* go */ }}>
                        <Text style={styles.itemText}>Konto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item} onPress={() => { /* go */ }}>
                        <Text style={styles.itemText}>Wsparcie</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end', padding: 20 },
    menu: {
        marginTop: 60, // Dostosuj do wysokości headera
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 10,
        elevation: 5, // Cień na Android
        shadowColor: '#000', // Cień na iOS
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 32,
    },
    item: { padding: 15 },
    itemText: { fontSize: 18, fontWeight: '500' }
});