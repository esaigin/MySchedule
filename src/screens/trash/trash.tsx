import { StyleSheet } from "react-native";
import React from "react";
import { useStorage } from "../../service";
import { TaskType } from "../../domain";
import { TasksList } from "../../components/tasks";
import { ScrollView } from "native-base";
import { useFocusEffect } from "@react-navigation/native";

const Trash = () => {
  const { getTrash } = useStorage();

  const [tasks, setTasks] = React.useState<TaskType[]>([]);

  const loadData = async () => {
    const tasks$ = await getTrash();
    tasks$.sort(
      (a, b) =>
        new Date(a.date + a.startedAt).getMilliseconds() -
        new Date(b.date + b.startedAt).getMilliseconds(),
    );
    setTasks(tasks$);
  };

  React.useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, []),
  );

  return (
    <>
      <ScrollView backgroundColor={"#565459"}>
        <TasksList tasks={tasks} />
      </ScrollView>
    </>
  );
};

export default Trash;

const styles = StyleSheet.create({});
