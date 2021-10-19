import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { Video, AVPlaybackStatus } from "expo-av";

export default function App() {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState();

  const INJECTED_JAVASCRIPT = `(function() {
    const button = document.createElement('button');
    button.innerHTML = 'Click from webview';
    button.style.cssText = 'position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);height: 50px';
    button.onclick = function(){
      window.ReactNativeWebView.postMessage(JSON.stringify({ name: 'toggleVideo' }));
      return false;
    };
    
    setTimeout(function() { document.getElementById('canvas').appendChild(button)}, 2000);
  })();`;

  const handleMessage = (event) => {
    const { name } = JSON.parse(event.nativeEvent.data);
    console.warn("message from webview: ", name);

    if (name === "toggleVideo") {
      status.isPlaying ? video.current.pauseAsync() : video.current.playAsync();
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        }}
        resizeMode="contain"
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
      <WebView
        style={styles.webview}
        source={{
          uri: "https://viz.flowics.com/public/77068a31b8e04c45493689216d28d2a8/5f88e243c9fd563ac9fbcabb/live",
        }}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        onMessage={handleMessage}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  video: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
