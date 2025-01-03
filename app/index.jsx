import {
  Button,
  FlatList,
  Image,
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
import { useState } from "react";

export default function TodoApp() {
  const [todo, setTodo] = useState("");
  const [fetchedTodos, setFetchedTodos] = useState(todos.sort());

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
        <Text
          style={(styles.text, item.completed && styles.completedText)}
          onPress={() => handleCompleteTodo(item.id)}
        >
          {item.title}
        </Text>
        <Pressable onPress={() => handleDeleteTodo(item.id)}>
          <Delete name="delete" size={25} color="red" />
        </Pressable>
      </View>
    );
  };

  const onChangeTodo = (e) => {
    setTodo(e.target.value);
  };

  const handleAddTodo = () => {
    if (todo.trim() !== "") {
      const newTodo = {
        // access the last element's id and add 1 to it
        id:
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

  return (
    <Container style={styles.container}>
      <View style={styles.form}>
        <TextInput
          placeholder="Add todo"
          value={todo}
          onChange={onChangeTodo}
          style={styles.input}
        />
        <Pressable style={styles.button} onPress={handleAddTodo}>
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
      </View>
      <FlatList
        data={fetchedTodos}
        keyExtractor={(todo) => todo.id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={separatorComp}
        ListEmptyComponent={emptyComp}
        style={styles.todos}
        renderItem={renderItem}
      />
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
    fontFamily: "Arial, sans-serif",
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
