

var PictureBox = React.createClass({
  getInstagramData: function(nextPageUrl) {
    $.ajax({
      url: nextPageUrl,
      dataType: 'jsonp',
      cache: false,
      async: false,
      success: function(data) {
        var thirtyDaysAgo = (Date.now() / 1000) - (60 * 60 * 24 * 30);
        var lessThanThirtyDaysAgo = _.all(data.data, function(instagramObject) {
          return instagramObject.created_time > thirtyDaysAgo;
        });
        if(lessThanThirtyDaysAgo) {
          this.setState({data: this.state.data.concat(data.data)});
          this.getInstagramData(data.pagination.next_url);
        }
        else {
          var filtered_data = _.filter(data.data, function(instagramObject){
            return instagramObject.created_time > thirtyDaysAgo;
          });
          this.setState({data: this.state.data.concat(filtered_data)})
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount : function() {
    this.getInstagramData(this.props.url);
  },
  render: function() {
    return (
      <div className='pictureBox'>
        <Pictures data={this.state.data} />
      </div>
    );
  }
});
var Pictures = React.createClass({
  render: function() {
    var pictureNodes = this.props.data.map(function (instagramObject) {
      return (
        <Picture url={instagramObject.images.standard_resolution.url} />
      );
    });
    return (
      <div className="pictures">
        {pictureNodes}
      </div>
    );
  }
});

var Picture = React.createClass({
  render: function() {
    return (
      <div className="picture">
        <div className="pictureUrl">
          <img src={this.props.url} />
        </div>
      </div>
    );
  }
});

React.render(
  <PictureBox url='https://api.instagram.com/v1/tags/dctech/media/recent?client_id=fcd848752dbb44bebe0143378aa2142c' />,
  document.getElementById("content")
);
