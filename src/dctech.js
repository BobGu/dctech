var data = [
             {url: 'http://bit.ly/1IU5upf'},
             {url: 'http://bit.ly/1M6PDo2'}
           ];
var Pictures = React.createClass({
  render: function() {
    var pictureNodes = this.props.data.map(function (picture) {
      return (
        <Picture url={picture.url} />
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
  <Pictures data={data} />,
  document.getElementById("content")
);
