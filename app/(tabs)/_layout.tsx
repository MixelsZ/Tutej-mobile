import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { View, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { logout } from '../../hooks/useAuth'; // Upewnij się, że masz wersję mobilną tego hooka
import { SettingsMenu } from '../../components/SettingsMenu';
import { Ionicons } from '@expo/vector-icons'; // Standard w Expo do ikon


export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#4CAF50' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Główna',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notices"
        options={{
          title: 'Ogłoszenia',
          tabBarIcon: ({ color }) => <Ionicons name="notifications" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="forum"
        options={{
          title: 'Forum',
          tabBarIcon: ({ color }) => <Ionicons name="chatbubbles" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="trade"
        options={{
          title: 'Giełda',
          tabBarIcon: ({ color }) => <Ionicons name="cart" size={28} color={color} />,
        }}
      />
       <Tabs.Screen
        name="events"
        options={{
          title: 'Wydarzenia',
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    height: 60,
    // Cień dla iOS i Androida (zastępuje styling navbara z weba)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderTopWidth: 0,
    paddingBottom: 5,
  },
  headerActions: {
    flexDirection: 'row',
    marginRight: 15,
    gap: 10,
  },
  actionButton: {
    padding: 5,
  },
  logoPlaceholder: {
    width: 100,
    height: 30,
    backgroundColor: '#eee', // Tu wrzuć swoje skomplikowane SVG
  }
});