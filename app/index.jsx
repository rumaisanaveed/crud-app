import {
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { todos } from "@/constants/todos";
import Delete from "react-native-vector-icons/AntDesign";
import { useEffect, useState } from "react";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

export default function TodoApp() {
  const [todo, setTodo] = useState("");
  const [fetchedTodos, setFetchedTodos] = useState([]);
  const [loaded, error] = useFonts({
    Inter_500Medium,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("todoapp");
        const storedTodos = jsonValue != null ? JSON.parse(jsonValue) : null;
        if (storedTodos && storedTodos.length) {
          setFetchedTodos(storedTodos);
        } else {
          // if we have nothing in storage
          setFetchedTodos(todos);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(fetchedTodos);
        await AsyncStorage.setItem("todoapp", jsonValue);
      } catch (error) {
        console.error(error);
      }
    };
    if (fetchedTodos.length) storeData();
  }, [fetchedTodos]);

  if (!loaded && !error) {
    return null;
  }

  const Container = Platform.OS === "web" ? ScrollView : SafeAreaView;
  const separatorComp = <View style={styles.separator} />;
  const emptyComp = (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>No Todos Found :|</Text>
    </View>
  );

  const renderItem = ({ item }) => {
    return (
      <View style={styles.row}>
        <Pressable
          onLongPress={() => handleCompleteTodo(item.id)}
          onPress={() => handlePress(item.id)}
        >
          <Text style={(styles.text, item.completed && styles.completedText)}>
            {item.title}
          </Text>
        </Pressable>
        <Pressable onPress={() => handleDeleteTodo(item.id)}>
          <Delete name="delete" size={25} color="red" />
        </Pressable>
      </View>
    );
  };

  const onChangeTodo = (text) => {
    setTodo(text);
  };

  const handleAddTodo = () => {
    if (todo.trim() !== "") {
      const newTodo = {
        // access the last element's id and add 1 to it
        id:
          // fetchedTodos[11 - 1].id + 1
          fetchedTodos.length > 0
            ? fetchedTodos[fetchedTodos.length - 1].id + 1
            : 1,
        title: todo,
        completed: false,
      };
      setFetchedTodos((prevTodos) => [...prevTodos, newTodo]);
      setTodo("");
    }
  };

  const handleCompleteTodo = (todoId) => {
    setFetchedTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (todoId) => {
    const filteredTodos = fetchedTodos.filter((todo) => todo.id !== todoId);
    setFetchedTodos(filteredTodos);
  };

  const handlePress = (id) => {
    router.push(`/todos/${id}`);
  };

  return (
    <Container style={styles.container}>
      <View style={styles.form}>
        <TextInput
          placeholder="Add todo"
          value={todo}
          onChangeText={onChangeTodo}
          style={styles.input}
        />
        <Pressable style={styles.button} onPress={handleAddTodo}>
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
      </View>
      <FlatList
        data={fetchedTodos}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={separatorComp}
        ListEmptyComponent={emptyComp}
        style={styles.todos}
        renderItem={renderItem}
      />
      <StatusBar />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  form: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 7,
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    width: "100%",
    fontSize: 20,
    fontFamily: "Inter_500Medium",
  },
  button: {
    backgroundColor: "black",
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  todos: {
    paddingVertical: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    width: "100%",
  },
  text: {
    fontSize: 20,
    fontFamily: Inter_500Medium,
    fontWeight: "500",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "black",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 30,
    fontWeight: "600",
  },
});
