import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import Iaphub from 'react-native-iaphub';

function SubsriptionVerification(props) {
	const { onActiveProductsReceived, iaphubAppId, apiKey, environment, userId, editor } = props
  const [initialized, setInitialized] = useState(false)
  const getProducts = async () => {
    try {
      const products = await Iaphub.getActiveProducts({
        includeSubscriptionStates: ['retry_period', 'paused']
      })
      if (onActiveProductsReceived) {
        products.forEach(product => onActiveProductsReceived(product.sku, product.type, product.subscriptionState))
      }
    } catch (e) {
      props.actions.onFailure(`Product Error: ${JSON.stringify(e)}`)
    }
  }
  useEffect(() => {
    if (initialized) {
      getProducts()
    }
  }, [initialized])
	useEffect(() => {
		if (iaphubAppId && apiKey && environment && userId && !editor) {
			init(iaphubAppId, apiKey, environment, userId)
		}
	}, [iaphubAppId, apiKey, environment, userId, editor])

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
        setInitialized(true)
			} catch (e) {
				props.actions.onFailure(`Initialization Error: ${JSON.stringify(e)}`)
			}
		}
	}
  if (editor) {
    return (
      <View>
        <Text>Active Product Component Installed</Text>
      </View>
    )
  } else {
    <View></View>
  }
}

export default SubsriptionVerification