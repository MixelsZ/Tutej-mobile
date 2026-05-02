import { View, StyleSheet } from 'react-native';
import Heading from '../../components/Heading';
import MyText from '../../components/MyText';
import { COLORS } from '../../constants/theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Heading text="Ekran Główny" />
      <MyText text="Gratulacje, jesteś w środku aplikacji (Tab 1)!" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
});