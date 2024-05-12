import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue', // Set the background color here
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputField_container: {
    flexDirection: 'column',
    gap: 10,
  },
  inputField: {
    width: 150,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: 'white', // Set the input field background color here
    padding: 5,
  },
  btn: {
    width: 150,
    height: 50,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 5,
    marginTop: 20,
  },
  btnText: {
    color: 'white',
    fontSize: 20,
  }
});

export default function Register() {
  return (
    <View style={styles.container}>
      <View style={styles.inputField_container}>
        <Text>Username:</Text>
        <TextInput style={styles.inputField} />
        <Text>Password:</Text>
        <TextInput style={styles.inputField} />
        <Text>Role:</Text>
        <TextInput style={styles.inputField} />
      </View>
      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Submit</Text>
      </TouchableOpacity>
    </View>
  )
}
