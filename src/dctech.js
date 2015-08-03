var data = {
             data: [
               {
                 images: {
                   standard_resolution: { url: 'http://bit.ly/1MHpXNJ'}
                 }
               }
             ]
           };
var Pictures = React.createClass({
  render: function() {
    var pictureNodes = this.props.data.data.map(function (instagramObject) {
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
  <Pictures data={data} />,
  document.getElementById("content")
);
