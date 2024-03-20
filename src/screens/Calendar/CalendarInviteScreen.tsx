import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { fetchUsers } from '../../utils/Api';
import { UserInfoType } from '../../context/type';
import DropDown from '../../components/DropDown';
import TimeZone from '../../components/CalendarSpecificComp/TimeZone';
import DisplayProfile from '../../components/CalendarSpecificComp/DisplayProfile';
import {
  decimalToTime,
  timestampToFormatTime,
  transformTime_,
  windowHeight,
} from '../../helpers/CalendarInviteHelpers';
import LayoutHeader from '../../components/CalendarSpecificComp/TableHeader';
import CalendarLayout from '../../components/CalendarSpecificComp/CalendarLayout';
import FloatingButton_ from '../../components/FloatingButton_';
import Toast from 'react-native-toast-message';

const CalendarInviteScreen = () => {
  const { loggedInUserData } = useContext(AuthContext);
  const [users, setUsers] = useState<UserInfoType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserInfoType[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [flag, setFlag] = useState(false);
  const [scrollTime, setScrollTime] = useState('00:00:00');
  const scrollViewRef = useRef();

  useEffect(() => {
    loggedInUserData && fetchUsers(loggedInUserData?.token, setUsers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUserIdChange = (info: UserInfoType) => {
    const userExists = users.some((user: UserInfoType) => user.id === info.id);
    if (!userExists) {
      setSelectedUser((prevUsers: UserInfoType[]) => [...prevUsers, info]);
    } else {
      Alert.alert('user already exist');
    }
  };

  const handleAddEvent = () => {
    // postLiveUsers('AAM0MZxZXEfWKmfdYOUp');
    // return;
    if (users.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Please Select User to create event',
        position: 'bottom',
      });
    } else {
      setFlag((prev) => !prev);
    }
  };

  const calculateOffsetVal = (scrollOffsetVal: number) => {
    // TODO:update 20 from progress val
    let totalVal;
    if (scrollOffsetVal > 0) {
      totalVal = scrollOffsetVal / ((120 * 20) / 50);
    }

    console.log('🚀 ~ calculateOffsetVal ~ totalVal:', totalVal);
    let transformTime = transformTime_(selectedDate, decimalToTime(totalVal));
    console.log('🚀 ~ calculateOffsetVal ~ transformTime:', transformTime);
    // let sTime = timestampToFormatTime(transformTime);
    // console.log('🚀 ~ calculateOffsetVal ~ sTime:', sTime);
    setScrollTime(transformTime);
    // return transformTime;
  };
  const onScrollHandler = (event: any) => {
    console.log(
      '🚀 ~ onScrollHandler ~ event:',
      event.nativeEvent.contentOffset.y,
    );
    let timeStamp = calculateOffsetVal(event.nativeEvent.contentOffset.y);
    console.log('🚀 ~ onScrollHandler ~ timeStamp:', timeStamp);
    // return calculateOffsetVal(timeStamp);
  };
  return (
    <>
      <FloatingButton_ handleButtonPress={handleAddEvent} />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        scrollEventThrottle={50}
        onScrollEndDrag={onScrollHandler}
        stickyHeaderIndices={[0]}
        ref={scrollViewRef}
        style={styles.scrollContainer}
      >
        <View style={styles.topHeader}>
          {/* zoom-scale */}
          <View style={styles.flexView}>
            <View style={styles.dropdown}>
              <DropDown
                title={'Select To invite'}
                handleUserId={handleUserIdChange}
                error={''}
                disabled={false}
              />
            </View>
            {/* checkbox */}
          </View>

          <TimeZone />
          <DisplayProfile
            setSelectedUsers={setSelectedUser}
            selectedUsers={selectedUser}
            multiModeOn={false}
          />

          <View style={styles.tableHeader}>
            <LayoutHeader
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </View>
          <View style={styles.border} />

          <View style={styles.displayTime}>
            <Text style={styles.textColor}>{scrollTime}</Text>
          </View>
        </View>

        <CalendarLayout
          setShowInviteForm={setFlag}
          showInviteForm={flag}
          selectedDate={selectedDate}
          progressVal={20}
          // usersWithTimeSlots={usersWithTimeSlots}
          // getMatchingTimeSlots={getData}
          userData={users}
        />
      </ScrollView>
    </>
  );
};

export default CalendarInviteScreen;
const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    overflow: 'scroll',
    backgroundColor: 'white',
    height: windowHeight,
  },
  flexView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdown: { width: '70%' },
  topHeader: { position: 'relative', top: 0, backgroundColor: 'white' },
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    zIndex: -1,
    backgroundColor: 'white',
  },
  displayTime: {
    position: 'absolute',
    top: 150,
    right: 0,
    borderWidth: 1,
    backgroundColor: 'black',
  },
  border: { borderWidth: 1, color: 'black', marginTop: 2, zIndex: -1 },
  textColor: { color: 'white' },
});
