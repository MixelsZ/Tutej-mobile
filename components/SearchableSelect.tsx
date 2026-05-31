import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS, FONTS } from '../styles/theme'; // Użyj swojego nowego motywu

interface Option {
  value: number;
  label: string;
}

export default function SearchableSelect({ onChange }: { onChange: (id: number) => void }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [search, setSearch] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');

  // Fetch danych (pamiętaj, że na emulatorze localhost to często 10.0.2.2)
  useEffect(() => {
    fetch('http://localhost:5000/api/neighborhoods')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((n: any) => ({ value: n.id, label: n.name }));
        setOptions(formatted);
        setFilteredOptions(formatted);
      })
      .catch(err => console.error("Błąd pobierania osiedli:", err));
  }, []);

  // Filtrowanie
  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = options.filter(item =>
      item.label.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleSelect = (item: Option) => {
    setSelectedLabel(item.label);
    onChange(item.value);
    setModalVisible(false);
    setSearch('');
    setFilteredOptions(options);
  };

  return (
    <View style={styles.container}>
      {/* "Input" który otwiera Modal */}
      <TouchableOpacity
        style={styles.selectTrigger}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.leftIcon}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
             <Path d="M3 21H21M19 21V17M19 17C19.5304 17 20.0391 16.7893 20.4142 16.4142C20.7893 16.0391 21 15.5304 21 15V13C21 12.4696 20.7893 11.9609 20.4142 11.5858C20.0391 11.2107 19.5304 11 19 11..." stroke={COLORS.darkGray} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </Svg>
        </View>
        <Text style={[styles.triggerText, !selectedLabel && { color: COLORS.darkGray }]}>
          {selectedLabel || "Wybierz osiedle"}
        </Text>
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <Path d="M6 9L12 15L18 9" stroke={COLORS.darkGray} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
      </TouchableOpacity>

      {/* Modal z listą */}
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TextInput
              style={styles.searchInput}
              placeholder="Szukaj osiedla..."
              value={search}
              onChangeText={handleSearch}
              autoFocus
            />
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Anuluj</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.optionItem} onPress={() => handleSelect(item)}>
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.noResults}>Nie znaleziono osiedla</Text>}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 15,
  },
  selectTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray,
    borderRadius: 12,
    height: 55,
    paddingHorizontal: 15,
  },
  leftIcon: {
    marginRight: 10,
  },
  triggerText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 18,
    color: COLORS.black,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  searchInput: {
    flex: 1,
    height: 45,
    backgroundColor: COLORS.gray,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontFamily: FONTS.regular,
    fontSize: 16,
  },
  closeButton: {
    marginLeft: 15,
    color: COLORS.green,
    fontFamily: FONTS.regular,
    fontWeight: 'bold',
  },
  optionItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  optionText: {
    fontFamily: FONTS.regular,
    fontSize: 18,
    color: COLORS.black,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.darkGray,
    fontFamily: FONTS.regular,
  }
});