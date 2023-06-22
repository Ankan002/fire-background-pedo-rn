import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Button,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import GoogleFit, { Scopes } from "react-native-google-fit";

export default function App() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [steps, setSteps] = useState<number>(0);

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

    const data = await GoogleFit.getDailySteps(new Date());

    console.log(data[2].steps);
    console.log(data);
  };

  const onDisconnectClick = () => {
    GoogleFit.disconnect();
    setIsConnected(false);
  };

  useEffect(() => {
    checkOnLoad();
  }, []);

  useEffect(() => {
    setInterval(async () => {
      ToastAndroid.show("HERE!!", 100);
      if (isConnected) {
        const data = await GoogleFit.getDailySteps(new Date());
        console.log(data);

        if (data.length < 1) return;
        ToastAndroid.show(`${data[data.length - 1]?.steps[0]?.value}`, 1000);
        console.log(data[data.length - 1].steps[0]?.value);
        if (data[data.length - 1]?.steps[0]?.value) {
          setSteps(data[data.length - 1]?.steps[0]?.value);
        }
      }
    }, 10000);
  }, [isConnected]);

  return (
    <View style={styles.container}>
      <Text>Steps:</Text>
      <Text style={styles.stepText}>{steps}</Text>
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
  stepText: {
    fontSize: 25,
    marginVertical: 10,
  },
});
