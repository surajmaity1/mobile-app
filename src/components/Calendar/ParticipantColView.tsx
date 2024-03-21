import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Profile from '../Profile';
import Modal from 'react-native-modal';

import UserDesc from '../../screens/CalendarInvite/UserDesc';
import { profileScreenStyles } from '../../screens/ProfileScreen/styles';
import {
  CELL_HEIGHT,
  getStartAndEndTime,
  screenHeight,
} from '../../helpers/SiteUtils';

const ParticipantColView = ({
  event,
  multiplier,
  getBorderBottomColor,
  selectedDate,
}: {
  event: any;
  multiplier: number;
  getBorderBottomColor: string;
  selectedDate: Date;
}) => {
  console.log('🚀 ~ event:>>>>>EVENT>>>>>>', event);
  // {"endTime": 1711004760, "eventName": "new event1", "eventScheduledBy": "T7IL7MB8YriniTw4bt39", "eventType": "public", "id": "pkySsTV4u0LmooguziDd", "startTime": 1711000860, "userId": ["0WLgXCnIWA2RuoJ1JZCn"], "users_": [{"created_at": 1710955352447, "first_name": "Siddhant", "github_created_at": 1641429822000, "github_display_name": "Siddhant Kumar Keshri", "github_id": "quantavoid11", "github_user_id": "97203165", "id": "0WLgXCnIWA2RuoJ1JZCn", "incompleteUserDetails": false, "last_name": "Keshri", "roles": [Object], "updated_at": 1710955374364, "username": "Quantavoid"}]}
  const [showSelectedUsersDetails, setShowSelectedUsersDetails] =
    useState(false);

  let { startTime, endTime, eventName, users_ } = event;
  const minHourSelectedDate =
    new Date(selectedDate).setHours(0, 0, 0, 0) / 1000;
  const maxHourSelectedDate =
    new Date(selectedDate).setHours(23, 59, 59, 59) / 1000;

  const startDate = new Date(startTime * 1000);
  const endDate = new Date(endTime * 1000); // Convert seconds to milliseconds

  // Extract hours and minutes
  let startHour = startDate.getHours();
  let startMinute = startDate.getMinutes();

  let endHour = endDate.getHours();
  let endMinute = endDate.getMinutes();
  if (endTime && endTime > maxHourSelectedDate) {
    endHour = 11;
    endMinute = 59;
  } else if (startTime && startTime < minHourSelectedDate) {
    startHour = 0;
    startMinute = 0;
  }
  const getTopAndHeight = () => {
    const height = endHour * 60 + endMinute - (startHour * 60 + startMinute);
    const top = startHour * 60 + startMinute;
    return {
      height: Math.abs((height * multiplier) / 60),
      top: (top * multiplier) / 60,
    };
  };

  const { height, top } = getTopAndHeight();
  const getProfileHeight = () => {
    const maxProfileSize = 300; // Set your maximum height or width here

    // Calculate the profileHeight and profileWidth based on the height variable
    let calculatedHeight = (height * 20) / 100;
    let calculatedWidth = (height * 20) / 100;

    // Check if the calculated height exceeds the maximum, and if so, set it to the maximum
    if (calculatedHeight > maxProfileSize) {
      calculatedHeight = maxProfileSize;
    }

    // Check if the calculated width exceeds the maximum, and if so, set it to the maximum
    if (calculatedWidth > maxProfileSize) {
      calculatedWidth = maxProfileSize;
    }
    console.log({ calculatedHeight, calculatedWidth });
  };
  const toggleDesc = () => {
    setShowSelectedUsersDetails((prev) => !prev);
  };
  return (
    <TouchableOpacity
      onPress={toggleDesc}
      style={[
        styles.event,
        {
          height: height | 0,
          top: top || 0,
          position: 'absolute',
          borderWidth: 1,
          width: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottomColor: getBorderBottomColor ?? 'black',
        },
      ]}
    >
      {users_.map((user) => (
        <>
          <Profile
            selectedUser={{
              picture: user.picture,
              first_name: user.first_name,
              last_name: user.last_name,
              id: user.id,
            }}
            profileHeight={getProfileHeight()}
            profileWidth={getProfileHeight()}
          />
          {showSelectedUsersDetails && (
            <Modal
              transparent={true}
              isVisible={showSelectedUsersDetails}
              onBackdropPress={toggleDesc}
              onBackButtonPress={toggleDesc}
              backdropOpacity={0.7}
              animationIn="slideInUp"
              animationOut="slideOutDown"
              style={profileScreenStyles.modal}
            >
              <UserDesc
                startTime={startTime}
                endTime={endTime}
                eventName={eventName}
                setModalVisible={showSelectedUsersDetails}
                user={user}
              />
            </Modal>
          )}
        </>
      ))}
    </TouchableOpacity>
  );
};

export default ParticipantColView;

const styles = StyleSheet.create({
  container: {
    height: screenHeight,
  },
  event: {
    height: CELL_HEIGHT,
    borderWidth: 1,
  },
});
