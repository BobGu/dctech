

var PictureBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'jsonp',
      cache: false,
      success: function(data) {
        this.setState({data: data.data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
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
