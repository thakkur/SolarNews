import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import isEmpty from 'lodash/isEmpty';
import { fetchApi, setPage } from '../../store/actions';
import ArticleCarousel from '../../components/ArticleCarousel';
import colors from '../../../design/index';
import Error404 from '../../components/Error404';
import AdvertisementBanner from '../../components/AdvertisementBanner';
import FullArticleItem from '../../components/FullArticleItem';
import AdConfig from '../../config/adsConfig';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      typeOfArticle: false
    };
  }

  componentDidMount() {
    this.handleLoadMore();
  }

  handleLoadMore = () => {
    this.props.fetchApi(this.props.activeSite, this.props.type, this.props.page);
    this.props.setPage(this.props.page);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeSite !== this.props.activeSite) {
      this._onRefresh();
    }
  }

  _onRefresh = () => {
    this.setState({
      refreshing: true
    }, () => {
      this.props.fetchApi(this.props.activeSite, this.props.type, 1, true).then(() => {
        this.setState({ refreshing: false });
      });
    });
  };

  renderItems = () => {
    if (isEmpty(this.props.result)) {
      return <Error404 onRefresh={this._onRefresh}/>;
    }
    return (
      <FlatList
        data={this.props.result}
        renderItem={({ item }) => <FullArticleItem {...this.props} article={item}/>}
        onEndReached={this.handleLoadMore}
        onEndThreshold={0}
        keyExtractor={(item, index) => index}
        refreshControl={<RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh.bind(this)}
          title="Updating Top 20"
          tintColor="#fff"
          titleColor="#fff"
        />
        }
      />
    );

  };

  static get gradient() {
    return (
      <LinearGradient
        colors={[colors.mainColor, colors.lightMainColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      />
    );
  }

  render() {
    return (
      <View scrollEnabled={false} style={styles.contentContainer}>
        { this.gradient }
        <ArticleCarousel />
        {this.renderItems()}
        <AdvertisementBanner adUnitID={AdConfig.banner.homeAdID}/>
        <View style={styles.loader}>
          <ActivityIndicator animating={this.props.isFetching}/>
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: colors.mainColor,
    flex: 1,
    padding: 0
  },
  hideButton: {
    opacity: 0.4,
    width: 80,
    margin: 0,
    padding: 0,
  },
  loader: {
    flex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject
  },
});

const mapStateToProps = ({ apiReducer, appReducer }) => {
  return {
    result: apiReducer.result,
    isFetching: apiReducer.isFetching,
    type: apiReducer.type,
    page: apiReducer.page,
    activeSite: appReducer.activeSite,
    typeOfArticle: appReducer.typeOfArticle,
    fontSize: appReducer.fontSize
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchApi: bindActionCreators(fetchApi, dispatch),
    setPage: bindActionCreators(setPage, dispatch),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
