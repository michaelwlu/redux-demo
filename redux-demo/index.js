const redux = require("redux");
const createStore = redux.createStore;
const bindActionCreators = redux.bindActionCreators;
const combineReducers = redux.combineReducers;
const applyMiddleware = redux.applyMiddleware;

const produce = require("immer").produce;

const reduxLogger = require("redux-logger");
const logger = reduxLogger.createLogger();

// Actions Types
const CAKE_ORDERED = "CAKE_ORDERED";
const CAKE_RESTOCKED = "CAKE_RESTOCKED";
const ICECREAM_ORDERED = "ICECREAM_ORDERED";
const ICECREAM_RESTOCKED = "ICECREAM_RESTOCKED";

// Actions
function orderCake(qty = 1) {
	return {
		type: CAKE_ORDERED,
		payload: qty,
	};
}

function restockCake(qty = 1) {
	return {
		type: CAKE_RESTOCKED,
		payload: qty,
	};
}

function orderIceCream(qty = 1) {
	return {
		type: ICECREAM_ORDERED,
		payload: qty,
	};
}

function restockIceCream(qty = 1) {
	return {
		type: ICECREAM_ORDERED,
		payload: qty,
	};
}

// Initial State
// const initialState = {
// 	numOfCakes: 10,
// 	numOfIceCreams: 20,
// };

const initialCakeState = {
	numOfCakes: 10,
};

const initialIceCreamState = {
	numOfIceCreams: 20,
};

// Reducer Function
const cakeReducer = (state = initialCakeState, action) => {
	switch (action.type) {
		case CAKE_ORDERED:
			return {
				...state,
				numOfCakes: state.numOfCakes - action.payload,
			};
		case CAKE_RESTOCKED:
			return {
				...state,
				numOfCakes: state.numOfCakes + action.payload,
			};
		default:
			return state;
	}
};

const iceCreamReducer = (state = initialIceCreamState, action) => {
	switch (action.type) {
		case ICECREAM_ORDERED:
			// return {
			// 	...state,
			// 	numOfIceCreams: state.numOfIceCreams - action.payload,
			// };
			return produce(state, (draft) => {
				draft.numOfIceCreams -= action.payload;
			});
		case ICECREAM_RESTOCKED:
			return {
				...state,
				numOfIceCreams: state.numOfIceCreams + action.payload,
			};
		default:
			return state;
	}
};

const rootReducer = combineReducers({
	cake: cakeReducer,
	iceCream: iceCreamReducer,
});

const store = createStore(rootReducer, applyMiddleware(logger));
console.log("Initial state", store.getState());

const unsubscribe = store.subscribe(() => {});

// store.dispatch(orderCake());
// store.dispatch(orderCake());
// store.dispatch(orderCake());
// store.dispatch(restockCake(3));

const actions = bindActionCreators(
	{ orderCake, restockCake, orderIceCream, restockIceCream },
	store.dispatch
);

actions.orderCake();
actions.orderCake();
actions.orderCake();
actions.restockCake(3);
actions.orderIceCream();
actions.orderIceCream();
actions.orderIceCream();

unsubscribe();

/*
Initial state { cake: { numOfCakes: 10 }, iceCream: { numOfIceCreams: 20 } }
updated state { cake: { numOfCakes: 9 }, iceCream: { numOfIceCreams: 20 } }
updated state { cake: { numOfCakes: 8 }, iceCream: { numOfIceCreams: 20 } }
updated state { cake: { numOfCakes: 7 }, iceCream: { numOfIceCreams: 20 } }
updated state { cake: { numOfCakes: 10 }, iceCream: { numOfIceCreams: 20 } }
updated state { cake: { numOfCakes: 10 }, iceCream: { numOfIceCreams: 19 } }
updated state { cake: { numOfCakes: 10 }, iceCream: { numOfIceCreams: 18 } }
updated state { cake: { numOfCakes: 10 }, iceCream: { numOfIceCreams: 17 } }
*/
