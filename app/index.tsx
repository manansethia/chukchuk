import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getTrainStatus, TrainEvent, TrainStatus } from '../services/api';

export default function HomeScreen() {
  const [trainNumber, setTrainNumber] = useState('');
  const [trainData, setTrainData] = useState<TrainStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (trainNumber.length !== 5) {
      Alert.alert('Invalid', 'Please enter a 5-digit train number');
      return;
    }
    setLoading(true);
    setTrainData(null);
    try {
      const data = await getTrainStatus(trainNumber);
      setTrainData(data);
    } catch (e) {
      Alert.alert('Error', 'Could not fetch train status. Is the API running?');
    } finally {
      setLoading(false);
    }
  };

  const renderEvent = ({ item }: { item: TrainEvent }) => (
    <View style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <Text style={[
          styles.eventType,
          item.type === 'Arrived' ? styles.arrived : styles.departed
        ]}>
          {item.type ?? 'Unknown'}
        </Text>
        {item.delay && (
          <Text style={styles.delay}>+{item.delay} delay</Text>
        )}
      </View>
      <Text style={styles.stationName}>
        {item.station ?? 'Unknown Station'}
        {item.code ? ` (${item.code})` : ''}
      </Text>
      {item.datetime && (
        <Text style={styles.datetime}>
          {new Date(item.datetime).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          {' · '}
          {new Date(item.datetime).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
          })}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>ChukChuk 🚂</Text>
        <Text style={styles.tagline}>हर train की आवाज़</Text>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter train number (e.g. 12951)"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={5}
          value={trainNumber}
          onChangeText={setTrainNumber}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          activeOpacity={0.8}
        >
          <Text style={styles.searchButtonText}>Track</Text>
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading && (
        <ActivityIndicator
          size="large"
          color="#E63946"
          style={{ marginTop: 40 }}
        />
      )}

      {/* Results */}
      {trainData && (
        <View style={styles.results}>
          <View style={styles.trainHeader}>
            <Text style={styles.trainNumber}>
              Train {trainData.train_number}
            </Text>
            {trainData.start_date && (
              <Text style={styles.startDate}>
                Journey: {trainData.start_date}
              </Text>
            )}
            {trainData.last_update && (
              <Text style={styles.lastUpdate}>
                Updated:{' '}
                {new Date(trainData.last_update).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            )}
          </View>

          <FlatList
            data={trainData.events}
            keyExtractor={(_, i) => i.toString()}
            renderItem={renderEvent}
            ListEmptyComponent={
              <Text style={styles.noEvents}>
                No events found for today yet.
              </Text>
            }
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 28,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  searchButton: {
    backgroundColor: '#E63946',
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  results: {
    flex: 1,
  },
  trainHeader: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  trainNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  startDate: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  lastUpdate: {
    fontSize: 13,
    color: '#E63946',
    marginTop: 2,
  },
  eventCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  eventType: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  arrived: {
    color: '#2ECC71',
  },
  departed: {
    color: '#E63946',
  },
  delay: {
    fontSize: 12,
    color: '#F39C12',
    fontWeight: '500',
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  datetime: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  noEvents: {
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
  },
});