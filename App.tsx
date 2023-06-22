import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";
import GoogleFit, { Scopes } from "react-native-google-fit";

export default function App() {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const checkOnLoad = async () => {
    const res = await GoogleFit.authorize({
      scopes: [
        Scopes.FITNESS_ACTIVITY_READ,
        Scopes.FITNESS_ACTIVITY_WRITE,
        Scopes.FITNESS_BODY_READ,
        Scopes.FITNESS_BODY_WRITE,
      ],
    });

    if (!res.success) {
      Alert.alert("Not Auth");
      BackHandler.exitApp();
    }

    setIsConnected(true);
  };

  const onDisconnectClick = () => {
    GoogleFit.disconnect();
    setIsConnected(false);
  };

  useEffect(() => {
    checkOnLoad();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      {isConnected && <Button title="Disconnect" onPress={onDisconnectClick} />}
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
