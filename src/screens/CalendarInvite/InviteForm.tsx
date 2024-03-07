import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useState } from 'react';
import { TextInput } from 'react-native-paper';
import InputBox from '../../components/InputBox';
import Button_ from '../../components/Button_';
import {
  formatDate,
  formatTimeSlotTime,
  getColonTime,
  screenHeight,
  screenWidth,
} from '../../helpers/SiteUtils';
import Duration from './Duration';
import { durations, postEvent } from './dummy';
import { AuthContext } from '../../context/AuthContext';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { set } from 'react-native-reanimated';

// assigned To : automatically will come selectedUsers on submit it should send userids of these peoiple

// event title
// Event description
// time it will already show (whatever i selected) ; duration (can select tille 60 min)
//
function changeDateFormat(dateStr) {
  console.log('🚀 ~ changeDateFormat ~ dateStr:', dateStr);
  // Split the date string
  var dateComponents = dateStr.split('/');

  // Rearrange the components
  var newDateStr =
    dateComponents[1] + '/' + dateComponents[0] + '/' + dateComponents[2];

  return newDateStr;
}

function getDateObject(dateStr, time) {
  var [hours, minutes] = time.split(':');
  dateStr.setHours(Number(hours), Number(minutes));
  console.log('newDate', dateStr);
  return dateStr;
}
const InviteForm = ({
  userData,
  selectedTime,
  selectedDate,
  handleEventSubmit,
  setSelectedTime,
  toggleForm,
}: any) => {
  console.log('selectedDae', selectedDate);
  const [eventTitle, setEventTitle] = useState('');
  const [showEndClock, setShowEndClock] = useState(false);
  const [endTime, setEndTime] = useState(
    getColonTime(
      new Date(selectedDate).setMinutes(
        new Date(selectedDate).getMinutes() + 5,
      ),
    ),
  );
  const [eTime, setEtime] = useState(
    `${new Date().getHours()}:${new Date().getMinutes() + 15}`,
  );
  const [startTime, setStartTime] = useState(getColonTime(selectedDate));
  const [duration, setDuration] = useState(durations[0]);
  const { loggedInUserData } = useContext(AuthContext);
  const [showClock, setShowClock] = useState(false);
  const [error, setError] = useState('');
  const handleTitleChange = (text: string) => {
    if (text) {
      setError('');
    }
    setEventTitle(text);
  };

  const toUnix = (_date: any) => {
    const dateTimeString = _date;
    const unixTimestamp = moment(dateTimeString).unix();
    return unixTimestamp;
  };

  const handleSubmitTime = () => {
    // dd/mm/yy
    // convert from dd/mm/yy to yy/mm/dd
    console.log('selectedDate>>>>>>', selectedDate, startTime, endTime); // 2024-03-09T01:19:00.000Z 20:07 23:45
    // selectedDate = selectedDate.split('T')[0];
    const date = new Date(selectedDate);
    const formattedDate = date.toLocaleDateString().split('/');
    // const formatD = formattedDate[1]

    console.log('🚀 ~ handleSubmitTime ~ formattedDate:', formattedDate);
    const formatDD = `20${formattedDate[2]}-${formattedDate[0]}-${formattedDate[1]}T${startTime}`; // 2024-02-29T10:00
    let formattedEDate;
    console.log('🚀 ~ handleSubmitTime ~ formatDD:', formatDD); //2024-03-09T20:07
    // if (endTime < selectedTime) {
    //   console.log('here inside if');
    //   const formattedDate_ = new Date(eTime).toISOString().split('T')[0];
    //   formattedEDate = `${formattedDate_}T${endTime}`;
    // } else {
    formattedEDate = `20${formattedDate[2]}-${formattedDate[0]}-${formattedDate[1]}T${endTime}`;
    // }
    console.log('🚀 ~ handleSubmitTime ~ formattedEDate:', formattedEDate); //2024-03-09T23:45
    const formatStartDD = toUnix(formatDD);
    console.log('🚀 ~ handleSubmitTime ~ formatStartDD:', formatStartDD); //1710032820

    const formatEndDD = toUnix(formattedEDate); //1710045900
    console.log('🚀 ~ handleSubmitTime ~ formatEndDD:', formatEndDD);

    return { formatStartDD, formatEndDD };
  };

  const handleButtonHandler = () => {
    if (!eventTitle) {
      setError('Event title should not be empty');
    } else {
      setError('');
      const { formatStartDD: startUT, formatEndDD: endUT } = handleSubmitTime();
      const userIds = userData.map((item) => item.id);
      const data = {
        userId: userIds,
        eventType: 'public',
        eventName: eventTitle,
        eventScheduledBy: loggedInUserData?.id,
        startTime: Number(startUT),
        endTime: Number(endUT),
      };
      console.log('🚀 ~ handleButtonHandler ~ data:', data);
      postEvent(data)
        .then(() => {
          handleEventSubmit(data);
          toggleForm();
          Toast.show({
            type: 'success',
            text1: 'event created successfully',
            position: 'bottom',
          });
        })
        .catch((err) =>
          Toast.show({
            type: 'error',
            text1: err,
            position: 'bottom',
          }),
        );
    }
  };
  const setMaxTime = () => {
    const maxTime = new Date();
    maxTime.setHours(23);
    maxTime.setMinutes(45);
    return maxTime;
  };

  // Function to set the maximum time for the end time picker to 23:45
  const getMaximumEndTime = () => {
    const maximumTime = new Date();
    maximumTime.setHours(23);
    maximumTime.setMinutes(45);
    return maximumTime;
  };
  function addDaysToDate(inputDate, numberOfDays) {
    const initialDate = new Date(inputDate);

    initialDate.setDate(initialDate.getDate() + numberOfDays);
    return initialDate;
  }

  // Example usage:

  const adjustEndTime = (time: Date) => {
    const endTime_ = getColonTime(time);
    const startTime_ = selectedTime;
    console.log(
      '🚀 ~ adjustEndTime ~ startTime_:',
      startTime_,
      endTime_,
      selectedDate,
    );

    if (endTime_ < startTime_) {
      //2024-03-06T17:26:08.482Z
      let newD = addDaysToDate(time, 1);
      console.log('🚀 ~ adjustEndTime ~ newD:', newD); //2024-03-07T17:27:00.000Z
      setEtime(newD);
      return getColonTime(newD);
      console.log('🚀 ~ adjustEndTime ~ newD:', newD, getColonTime(newD));
    }
    return endTime_;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {`Selected Date: ${formatDate(selectedDate)}`}
      </Text>
      <ScrollView>
        <InputBox
          title={eventTitle}
          label={'Event Name'}
          onChangeHandler={handleTitleChange}
          error={''}
          disabled={true}
        />
        {/* TODO: says text string error  */}
        {error.length > 0 && (
          <Text style={{ color: 'red', paddingTop: 2 }}>{error}</Text>
        )}
        <View style={styles.flexView}>
          <TouchableOpacity onPress={() => setShowClock((prev) => !prev)}>
            <InputBox
              title={startTime}
              label={'Start Time'}
              disabled={false}
              onChangeHandler={() => {}}
              error={''}
            />
          </TouchableOpacity>

          {showClock && (
            <DatePicker
              modal
              mode="time"
              open={showClock}
              date={getDateObject(selectedDate, startTime)}
              onConfirm={(time: any) => {
                console.log('🚀 ~ time:', time, getColonTime(time)); //2024-03-07T01:25:26.779Z 06:55
                setShowClock(false);
                setStartTime(getColonTime(time));
                setSelectedTime(getColonTime(time));
                handleEventSubmit(time);
              }}
              onCancel={() => {
                setShowClock(false);
              }}
              minimumDate={new Date()}
              maximumDate={setMaxTime()}
            />
          )}
          <TouchableOpacity onPress={() => setShowEndClock((prev) => !prev)}>
            <InputBox
              title={endTime}
              label={'End Time'}
              disabled={false}
              onChangeHandler={() => {}}
              error={''}
            />
          </TouchableOpacity>
          {showEndClock && (
            <DatePicker
              modal
              mode="time"
              open={showEndClock}
              date={getDateObject(selectedDate, endTime)}
              onConfirm={(time: any) => {
                console.log('🚀 ~ time:', time);
                setShowEndClock(false);
                // const adjustedEndTime = adjustEndTime(time);
                setEndTime(getColonTime(time));
                handleEventSubmit(getColonTime(time));
              }}
              onCancel={() => {
                setShowEndClock(false);
              }}
              // minimumDate={new Date()} // Set to current date
              maximumDate={getMaximumEndTime()} // Set to 23:45 of current date
            />
          )}
          {/* <Duration duration={duration} setDuration={setDuration} /> */}
        </View>
        <Button_
          title={'Submit'}
          submitHandler={handleButtonHandler}
          disabled={false}
        />
      </ScrollView>
    </View>
  );
};

export default InviteForm;

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    borderWidth: 2,
    borderColor: 'black',
    padding: 10,
    backgroundColor: '#F6F4F3',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    padding: 4,
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  flexView: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

// 1 ghante me ek he event book
