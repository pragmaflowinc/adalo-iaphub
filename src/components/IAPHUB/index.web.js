import React, { Component } from "react";

import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Button } from "@protonapp/react-native-material-ui";

import color from "color";

class Consumable extends Component {
  state = {
    loading: false,
    backgroundColor: this.props.primaryColor,
  };

  getContainerStyles() {
    let { type, primaryColor, borderRadius } = this.props.button;

    if (type === "contained") {
      return { backgroundColor: primaryColor, borderRadius };
    }

    if (type === "outlined") {
      let baseColor = color(primaryColor);
      let saturation = baseColor.hsl().color[1];
      let alpha = saturation <= 10 ? 0.23 : 0.5;
      let borderColor = baseColor.fade(1 - alpha).toString();

      return { borderColor, borderWidth: 1, borderRadius };
    }

    return {};
  }

  getTextStyles() {
    let { primaryColor, contrastColor, type, icon, styles, _fonts } = this.props.button;

    const textStyles = { fontWeight: "600" };

    if (contrastColor && type === "contained") {
      textStyles.color = contrastColor;
    } else {
      textStyles.color = primaryColor;
    }

    if (styles) {
      textStyles.fontFamily = styles.text.fontFamily;
      textStyles.fontWeight = styles.text.fontWeight;
    } else if (_fonts) {
      textStyles.fontFamily = _fonts.body;
    }

    if (icon) {
      textStyles.marginLeft = 8;
    }

    return textStyles;
  }

  getAdditionalProps() {
    let { type, shadow = true } = this.props.button;

    if (type === "contained" && shadow) {
      return { raised: true };
    }

    return {};
  }

  submitAction = async () => {
    const { web } = this.props;
    this.setState({ loading: true });
    if (web.action) await web.action();
    this.setState({ loading: false });
  };

  renderButton() {
    let { icon, action, text, upperCase } = this.props.button;

    let containerStyles = this.getContainerStyles();
    let iconStyles = this.getTextStyles();
    let textStyles = { ...this.getTextStyles() };
    let { editor } = this.props;

    if (icon) {
      textStyles.marginRight = 5;
    }

    if (upperCase) {
      textStyles.letterSpacing = 1;
    }

    return (
        <View>
          <Button
            {...this.getAdditionalProps()}
            upperCase={!!upperCase}
            icon={this.state.loading ? "" : icon}
            onPress={editor ? action : this.submitAction}
            text={this.state.loading ? "" : text}
            style={{
              container: containerStyles,
              icon: iconStyles,
              text: [textStyles, styles.text],
            }}
            disabled={this.state.loading}
          />
        </View>
    );
  }

  renderEmpty() {
    return <View></View>;
  }

  render() {
    debugger
    const { editor, web } = this.props;
    const hideButton = !editor && !web.show;
    return hideButton ? this.renderEmpty() : this.renderButton();
  }
}

Consumable.defaultProps = {
  button: {
    primaryColor: "#6200ee",
    contrastColor: "#fff",
    text: "",
    type: "text",
    borderRadius: 2,
  }
};

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Consumable;
