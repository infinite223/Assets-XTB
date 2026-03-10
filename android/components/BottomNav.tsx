import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { Home, Calendar, Plus, DollarSign, Settings } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';

export const BottomNav = ({ onFileSelect }: { onFileSelect: (uri: string) => void }) => {
  const pathname = usePathname();

  const handlePlusPress = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    if (!result.canceled) {
      onFileSelect(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.navbar}>
        <NavItem href="/" icon={Home} active={pathname === '/'} />
        <NavItem href="/history" icon={Calendar} active={pathname === '/history'} />

        <View style={{ width: 50 }} />

        <NavItem href="/dividends" icon={DollarSign} active={pathname === '/dividends'} />
        <NavItem href="/settings" icon={Settings} active={pathname === '/settings'} />
      </View>

      <TouchableOpacity style={styles.plusButton} onPress={handlePlusPress}>
        <Plus size={26} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const NavItem = ({ href, icon: Icon, active }: any) => (  
  <Link href={href} asChild>
    <TouchableOpacity style={styles.navItem}>
      <Icon size={24} color={active ? '#6366f1' : '#94a3b8'} strokeWidth={active ? 3 : 2} />
    </TouchableOpacity>
  </Link>
);

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },

  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    width: '90%',
    height: 70,

    backgroundColor: '#fafafa',
    borderRadius: 40,

    paddingHorizontal: 35,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },

  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  plusButton: {
    position: 'absolute',
    top: 10,

    backgroundColor: '#4f46e5',

    width: 50,
    height: 50,
    borderRadius: 30,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#6366f1',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
});
