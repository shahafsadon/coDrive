import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';

export default function DriveScreen() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>My Drive</Text>
        <Text style={styles.subtitle}>
          Your files and folders will appear here
        </Text>

        <View style={{ marginTop: 24 }}>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
});
