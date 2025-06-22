import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: 'white',
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6'
    }}>
      <View style={{
        width: 32,
        height: 32,
        backgroundColor: '#37474F',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Ionicons name="wallet" size={16} color="white" />
      </View>
      
      <Text style={{
        fontSize: 18,
        fontWeight: '500',
        color: '#1f2937'
      }}>
        {title}
      </Text>
      
      <TouchableOpacity style={{
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Ionicons name="notifications-outline" size={20} color="#374151" />
      </TouchableOpacity>
    </View>
  );
}