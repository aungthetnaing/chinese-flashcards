import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

import { colors } from "../theme";

interface Props {
  /** A single Chinese character to practice. */
  character: string;
  size?: number;
  onReady?: () => void;
  onQuizComplete?: (totalMistakes: number) => void;
  onMistake?: (strokeNum: number, mistakesOnStroke: number) => void;
  onCorrectStroke?: (strokeNum: number, remaining: number) => void;
}

export interface StrokeWriterHandle {
  animate: () => void;
  quiz: () => void;
}

function buildHtml(character: string, size: number): string {
  const safeChar = JSON.stringify(character);
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<style>
  html, body { margin: 0; padding: 0; background: ${colors.surfaceAlt}; }
  #wrap { display: flex; justify-content: center; align-items: center; height: 100vh; }
  #target { background: ${colors.surfaceAlt}; }
  .grid { stroke: ${colors.border}; stroke-width: 1; }
</style>
<script src="https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js"></script>
</head>
<body>
  <div id="wrap"><div id="target"></div></div>
  <script>
    var RN = window.ReactNativeWebView;
    function post(obj) { if (RN) { RN.postMessage(JSON.stringify(obj)); } }
    var size = ${size};
    var writer = null;

    function makeGrid(svg) {
      var ns = "http://www.w3.org/2000/svg";
      function line(x1, y1, x2, y2) {
        var l = document.createElementNS(ns, "line");
        l.setAttribute("x1", x1); l.setAttribute("y1", y1);
        l.setAttribute("x2", x2); l.setAttribute("y2", y2);
        l.setAttribute("class", "grid");
        l.setAttribute("stroke-dasharray", "4 4");
        svg.insertBefore(l, svg.firstChild);
      }
      line(0, 0, size, size);
      line(size, 0, 0, size);
      line(size / 2, 0, size / 2, size);
      line(0, size / 2, size, size / 2);
    }

    function create() {
      var target = document.getElementById("target");
      target.innerHTML = "";
      writer = HanziWriter.create("target", ${safeChar}, {
        width: size,
        height: size,
        padding: 8,
        showCharacter: false,
        showOutline: false,
        strokeColor: "${colors.text}",
        outlineColor: "${colors.border}",
        highlightColor: "${colors.accent}",
        drawingColor: "${colors.text}",
        drawingWidth: 24,
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 250,
        charDataLoader: function (ch, onComplete) {
          fetch("https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/" + ch + ".json")
            .then(function (r) { return r.json(); })
            .then(onComplete)
            .catch(function () { post({ type: "error", message: "data load failed" }); });
        },
      });
      var svg = target.querySelector("svg");
      if (svg) { makeGrid(svg); }
      post({ type: "ready" });
    }

    function animate() {
      if (!writer) { return; }
      writer.showOutline();
      writer.animateCharacter();
    }

    function startQuiz() {
      if (!writer) { return; }
      writer.hideOutline();
      writer.quiz({
        showHintAfterMisses: 3,
        onMistake: function (info) {
          post({ type: "mistake", strokeNum: info.strokeNum, mistakesOnStroke: info.mistakesOnStroke });
        },
        onCorrectStroke: function (info) {
          post({ type: "correct", strokeNum: info.strokeNum, remaining: info.strokesRemaining });
        },
        onComplete: function (info) {
          post({ type: "complete", totalMistakes: info.totalMistakes });
        },
      });
    }

    function handle(e) {
      try {
        var msg = JSON.parse(e.data);
        if (msg.type === "animate") { animate(); }
        else if (msg.type === "quiz") { startQuiz(); }
      } catch (err) {}
    }
    document.addEventListener("message", handle);
    window.addEventListener("message", handle);

    if (window.HanziWriter) { create(); }
    else { window.addEventListener("load", create); }
  </script>
</body>
</html>`;
}

export const StrokeWriter = forwardRef<StrokeWriterHandle, Props>(
  function StrokeWriter(
    {
      character,
      size = 260,
      onReady,
      onQuizComplete,
      onMistake,
      onCorrectStroke,
    },
    ref,
  ) {
    const webRef = useRef<WebView>(null);
    const html = useMemo(() => buildHtml(character, size), [character, size]);

    const send = (obj: object) => {
      webRef.current?.injectJavaScript(
        `handle({ data: '${JSON.stringify(obj)}' }); true;`,
      );
    };

    useImperativeHandle(ref, () => ({
      animate: () => send({ type: "animate" }),
      quiz: () => send({ type: "quiz" }),
    }));

    const onMessage = (event: WebViewMessageEvent) => {
      try {
        const msg = JSON.parse(event.nativeEvent.data);
        switch (msg.type) {
          case "ready":
            onReady?.();
            break;
          case "complete":
            onQuizComplete?.(msg.totalMistakes ?? 0);
            break;
          case "mistake":
            onMistake?.(msg.strokeNum, msg.mistakesOnStroke);
            break;
          case "correct":
            onCorrectStroke?.(msg.strokeNum, msg.remaining);
            break;
          default:
            break;
        }
      } catch {
        // Ignore malformed messages.
      }
    };

    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <WebView
          ref={webRef}
          originWhitelist={["*"]}
          source={{ html }}
          style={styles.web}
          scrollEnabled={false}
          onMessage={onMessage}
          javaScriptEnabled
          domStorageEnabled
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.surfaceAlt,
  },
  web: {
    backgroundColor: colors.surfaceAlt,
  },
});
