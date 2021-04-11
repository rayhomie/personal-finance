import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SegmentedControl, Modal, Tabs } from '@ant-design/react-native';
import moment from 'moment';
import getTitle from './tabTitles';

interface MineProps {}
const Mine: React.FC<MineProps> = props => {
  const [type, setType] = useState<number>(1);
  const [showIsIncome, setShowIsIncome] = useState<{
    show: boolean;
    is_income: 0 | 1;
  }>({ show: false, is_income: 0 });
  const nowUnix = moment().unix();
  const [tabTitle, setTabTitle] = useState<{ title: string }[]>([
    { title: '1st Tab' },
    { title: '2nd Tab' },
    { title: '3rd Tab' },
    { title: '4th Tab' },
    { title: '5th Tab' },
    { title: '6th Tab' },
    { title: '7th Tab' },
    { title: '8th Tab' },
    { title: '9th Tab' },
  ]);

  useEffect(() => {
    setTabTitle(getTitle[type](nowUnix).Title);
    console.log(getTitle[type](nowUnix));
  }, [type]);

  const handleType = (e: any) => {
    setType(e.nativeEvent.selectedSegmentIndex + 1);
  };

  const Line = () => (
    <View style={styles.line}>
      <View style={styles.lineLeft} />
      <View style={styles.lineRight} />
    </View>
  );

  const IsIncomeModal = useMemo(
    () => () => (
      <Modal
        popup
        animationType="slide"
        maskClosable
        visible={showIsIncome.show}
        onClose={() => {
          setShowIsIncome(pre => ({ ...pre, show: false }));
        }}
      >
        <View style={styles.iscomeModal}>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => selectIncome(0)}
          >
            <View style={styles.iconIncomeContainer}>
              <Image
                style={styles.iconIncome}
                source={require('@/assets/image/tally_select_expenditure.png')}
              />
            </View>
            <View style={styles.listText}>
              <Text style={styles.listTextWord}>支出</Text>
              {showIsIncome.is_income ? (
                <View />
              ) : (
                <Image
                  style={styles.iconIncome}
                  source={require('@/assets/image/tally_select_right.png')}
                />
              )}
            </View>
          </TouchableOpacity>
          {Line()}
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => selectIncome(1)}
          >
            <View style={styles.iconIncomeContainer}>
              <Image
                style={styles.iconIncome}
                source={require('@/assets/image/tally_select_income.png')}
              />
            </View>
            <View style={styles.listText}>
              <Text style={styles.listTextWord}>收入</Text>
              {showIsIncome.is_income ? (
                <Image
                  style={styles.iconIncome}
                  source={require('@/assets/image/tally_select_right.png')}
                />
              ) : (
                <View />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    ),
    [showIsIncome]
  );

  const selectIncome = (Type: 0 | 1) => {
    setShowIsIncome(pre => ({ ...pre, show: false, is_income: Type }));
  };

  const renderContent = (tab: any, index: any) => {
    const style: any = {
      paddingVertical: 40,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 10,
      backgroundColor: '#ddd',
    };

    return (
      <ScrollView style={{ backgroundColor: '#fff' }}>
        <View key={`${index}`} style={style}>
          <Text>{tab.title}</Text>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.header}
          onPress={() => setShowIsIncome(pre => ({ ...pre, show: true }))}
        >
          <Text style={styles.headerText}>
            {showIsIncome.is_income ? '收入' : '支出'}
          </Text>
          <Image
            style={styles.icon}
            source={require('@/assets/image/time_down.png')}
          />
        </TouchableOpacity>
      </View>
      <SegmentedControl
        values={['周', '月', '年']}
        selectedIndex={type - 1}
        style={styles.typeControl}
        onChange={handleType}
      />
      <View style={styles.Tab}>
        <Tabs tabs={tabTitle} initialPage={1} tabBarPosition="top">
          {renderContent}
        </Tabs>
      </View>
      {IsIncomeModal()}
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: { width: screenWidth },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  headerText: {
    fontSize: 20,
  },
  icon: { width: 15, height: 15, marginLeft: 2 },
  typeControl: {},
  iscomeModal: { paddingTop: 50 },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: screenWidth,
  },
  iconIncomeContainer: {
    width: 50,
    height: 50,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  iconIncome: {
    width: 20,
    height: 20,
  },
  listText: {
    paddingRight: 20,
    width: screenWidth - 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listTextWord: { fontSize: 18 },
  line: { width: screenWidth, height: 1, flexDirection: 'row' },
  lineLeft: { width: 50, height: 1 },
  lineRight: { width: screenWidth - 50, height: 1, backgroundColor: '#bfbfbf' },
  Tab: {
    width: screenWidth,
    height: screenHeight - 190,
  },
});

export default Mine;
