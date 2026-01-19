import { View, Text, StyleSheet } from 'react-native';

export default function TrashScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Trash</Text>
            <Text style={styles.subtitle}>
                Deleted files will appear here
            </Text>
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
