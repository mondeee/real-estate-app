import Colors from './Colors'

export default {
  mainContainer: {
    width: '100%',
    height: '100%',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    shadowRadius: 3,
    shadowOpacity: 0.2,
    elevation: 3,
    textAlign: 'right',
    shadowOffset: { width: 1, height: 1 },
  },
  titleStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'Ge_ss',
    marginBottom: 10,
  },
  lineDividerHorizontal: {
    height: 1,
    width: '100%',
    backgroundColor: `${Colors.gray}50`,
  },
  fontRegular: {
    fontFamily: 'tajawal'
  },
  fontBold: {
    fontFamily: 'tajawal_bold'
  },
  fontLight: {
    fontFamily: 'tajawal_light'
  }
}