var Pictures = React.createClass({
  render: function() {
    return (
      <div className="pictures">
        <Picture photo="http://bit.ly/1KLVE9o" />
        <Picture photo="http://bit.ly/1KMdeah" />
      </div>
    );
  }
});

var Picture = React.createClass({
  render: function() {
    return (
      <div className="picture">
        <div className="picturePhoto">
          <img src={this.props.photo} />
        </div>
      </div>
    );
  }
});

React.render(
  <Pictures />,
  document.getElementById("content")
);
