import { Heading, Icon, IconButton, ScrollView } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import React from "react";
import { Task, TasksList } from "../../components/tasks";
import { TaskType } from "../../domain";
import { RootStackParamList } from "../../routes";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useStorage } from "../../service";
import { useFocusEffect } from "@react-navigation/native";

export type MyTasksScreenProps = DrawerScreenProps<
  RootStackParamList,
  "MyTasks"
>;

const MyTasksPage: React.FC<MyTasksScreenProps> = ({ route, navigation }) => {
  const formatDate = (date: string) => {
    const days = [
      "воскресенье",
      "понедельник",
      "вторник",
      "среда",
      "четверг",
      "пятница",
      "суббота",
    ];
    const months = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ];
    const chossenDate = new Date(date);
    const day = chossenDate.getDay();
    const month = chossenDate.getMonth();
    const day2 = chossenDate.getDate();
    const today =
      new Date().toISOString().split("T")[0] === date ? "Сегодня " : "";
    return `${today}${day2} ${months[month]}, ${days[day]}`;
  };

  const [tasks, setTasks] = React.useState<TaskType[]>([]);
  const { getData, getAllKeys } = useStorage();

  const loadData = async () => {
    getAllKeys();
    const tasks$ = await getData(route.params.date);
    setTasks(tasks$);
  };

  React.useEffect(() => {
    loadData();
  }, [route.params.date]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("drawerItemPress", () => {
      navigation.navigate("MyTasks", {
        date: new Date().toISOString().split("T")[0],
      });
      navigation.closeDrawer();
    });

    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, []),
  );

  const onPress = () => {
    navigation.navigate("create");
  };

  return (
    <>
      <ScrollView backgroundColor={"#565459"}>
        <Heading
          marginLeft={4}
          marginTop={2}
          marginBottom={4}
          color="white"
          fontWeight="normal"
          fontSize={24}>
          {route.params?.date
            ? formatDate(route.params.date)
            : formatDate(new Date().toISOString().split("T")[0])}
        </Heading>
        <TasksList tasks={tasks} />
      </ScrollView>
      <IconButton
        onPress={onPress}
        position="absolute"
        right="5"
        bottom="5"
        borderRadius="full"
        backgroundColor="red.600"
        size="lg"
        icon={
          <Icon
            as={MaterialIcons}
            name="add"
            size="3xl"
            color="white"
            borderRadius="full"
          />
        }
      />
    </>
  );
};

export default MyTasksPage;
