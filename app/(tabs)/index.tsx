import { images } from "@/constants/images";
import { Text, View, Image } from "react-native";

export default function Index() {
  return (
    <View
      className="flex-1 bg-primary"
    >
      <Image
        source={images.bg}
        className="w-full absolute z-0"
      />
    </View>
  );
}
