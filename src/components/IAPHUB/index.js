import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import Iaphub from 'react-native-iaphub';
import { Button } from "@protonapp/react-native-material-ui";

const IAPHUB = (props) => {
	const [transactionProcessing, setTransactionProcessing] = useState(false)
	const { iaphubAppId, apiKey, androidProductSku, iosProductSku, environment, userId } = props
	const init = async (_appId, _apiKey, _environment, _userId) => {
		const initOpts = {
			appId: _appId,
			apiKey: _apiKey,
			environment: _environment
		}
		if (global.iaphub === undefined) {
			global.iaphub = true
			try {
				await Iaphub.init(initOpts)
				await Iaphub.setUserId(_userId);
			} catch (e) {
				props.actions.onFailure(`Initialization Error: ${JSON.stringify(error)}`)
			}
		}
	}
	useEffect(() => {
		if (iaphubAppId && apiKey && environment && userId) {
			init(iaphubAppId, apiKey, environment, userId)
		}
	}, [iaphubAppId, apiKey, environment, userId])

  const getContainerStyles = () => {
    let { type, primaryColor, borderRadius } = props.button;

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

  const getTextStyles = () => {
    let { primaryColor, contrastColor, type, icon, styles, _fonts } = props.button;

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

  const getAdditionalProps = () => {
    let { type, shadow = true } = props.button;

    if (type === "contained" && shadow) {
      return { raised: true };
    }
    return {};
  }

	const makePurchase = async () => {
		try {
			setTransactionProcessing(true)
			const sku = Platform.OS === "ios" ? iosProductSku : androidProductSku;
			const transaction = await Iaphub.buy(sku)
			if (transaction.webhookStatus === "failed") {
				if (props.actions.onVerificationFailed) {
					props.actions.onVerificationFailed()
				}
			} else {
				if (props.actions.onSuccess) {
					props.actions.onSuccess()
				}
			}
		} catch(error) {
			if (props.actions.onFailure) {
				props.actions.onFailure(JSON.stringify(error))
			}
		} finally {
			setTransactionProcessing(false)
		}
	}

	return(
		<View>
			<Button
				{...getAdditionalProps()}
				upperCase={!!props.button?.upperCase}
				icon={props.button?.icon}
				onPress={() => {
					makePurchase()
				}}
				text={props.button?.text}
				style={{
					container: getContainerStyles(),
					icon: getTextStyles(),
					text: [{ ...getTextStyles() }, styles.text],
				}}
				disabled={transactionProcessing}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	wrapper: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}
})

export default IAPHUB
