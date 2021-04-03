import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { ImageManager } from '@/assets/json/ImageManager';

const IM: any = ImageManager;

interface ListProps {
  sections: SectionsType;
  containerStyle?: any;
  handleSelect?: (item: any) => void;
}
type SectionsType = {
  id?: string;
  name?: string;
  data: any[];
}[];

const List: React.FC<ListProps> = props => {
  const { sections, containerStyle = {}, handleSelect = () => {} } = props;
  const [selected, setSelected] = useState<any>({
    icon_l: 'cc_entertainmente_game_l',
    icon_n: 'cc_entertainmente_game',
    icon_s: 'cc_entertainmente_game_s',
    id: 1,
    section_id: 1,
  });

  useEffect(() => {
    handleSelect(selected);
  }, [handleSelect, selected]);

  return (
    <ScrollView style={containerStyle}>
      {sections.map(item => {
        return (
          <View key={item.name}>
            <View style={styles.header}>
              <Text style={styles.headerText}>{item.name}</Text>
            </View>
            <View style={styles.itemContainer}>
              {item.data.map(i => {
                return (
                  <TouchableOpacity
                    key={i.id}
                    style={styles.touch}
                    onPress={() => {
                      if (selected.id !== i.id) {
                        setSelected(i);
                      }
                    }}
                  >
                    <Image
                      style={styles.item}
                      source={
                        selected.id === i.id ? IM[i.icon_s] : IM[i.icon_n]
                      }
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / 6 - 10;

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  headerText: {
    fontSize: 18,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    paddingTop: 10,
  },
  item: {
    width: itemWidth,
    height: itemWidth,
    borderRadius: itemWidth / 2,
  },
  touch: {
    borderRadius: itemWidth / 2,
    marginLeft: 60 / 7,
    marginTop: 60 / 7,
  },
});

export default List;
