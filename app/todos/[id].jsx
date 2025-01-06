import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function EditScreen() {
  const { id } = useLocalSearchParams();
  const [todo, setTodo] = useState({});
  const router = useRouter();

  const [loaded, error] = useFonts({
    Inter_500Medium,
  });

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const jsonValue = await AsyncStorage.getItem("todoapp");
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;

        if (storageTodos && storageTodos.length) {
          const myTodo = storageTodos.find((todo) => todo.id.toString() === id);
          setTodo(myTodo);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchData(id);
  }, [id]);

  if (!loaded && !error) {
    return null;
  }

  const styles = createStyles();

  const handleSave = async () => {
    try {
      const savedTodo = { ...todo, title: todo.title };

      const jsonValue = await AsyncStorage.getItem("todoapp");
      const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;

      if (storageTodos && storageTodos.length) {
        const otherTodos = storageTodos.filter(
          (todo) => todo.id !== savedTodo.id
        );
        const allTodos = [...otherTodos, savedTodo];
        await AsyncStorage.setItem("todoapp", JSON.stringify(allTodos));
      } else {
        await AsyncStorage.setItem("todoapp", JSON.stringify([savedTodo]));
      }

      router.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          maxLength={30}
          placeholder="Edit todo"
          placeholderTextColor="gray"
          value={todo?.title || ""}
          onChangeText={(text) => setTodo((prev) => ({ ...prev, title: text }))}
        />
      </View>
      <View style={styles.inputContainer}>
        <Pressable onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/")}
          style={[styles.saveButton, { backgroundColor: "red" }]}
        >
          <Text style={[styles.saveButtonText, { color: "white" }]}>
            Cancel
          </Text>
        </Pressable>
      </View>
      <StatusBar />
    </SafeAreaView>
  );
}

function createStyles() {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      backgroundColor: "white",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      gap: 6,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
      pointerEvents: "auto",
    },
    input: {
      flex: 1,
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      fontSize: 18,
      fontFamily: "Inter_500Medium",
      minWidth: 0,
      color: "black",
    },
    saveButton: {
      backgroundColor: "red",
      borderRadius: 5,
      padding: 10,
    },
    saveButtonText: {
      fontSize: 18,
      color: "white",
    },
  });
}
