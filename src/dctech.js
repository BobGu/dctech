var PictureBox = React.createClass({
  getAllData: function(nextPageUrl, allInstagramObjects ) {
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
          this.getAllData(data.pagination.next_url, allInstagramObjects.concat(data.data));
        }
        else {
          var filtered_data = _.filter(data.data, function(instagramObject){
            return instagramObject.created_time > thirtyDaysAgo;
          });
          allInstagramObjects = allInstagramObjects.concat(filtered_data);
          allInstagramObjects = _.map(allInstagramObjects, function(instagramObject) {
            instagramObject.url = instagramObject.images.standard_resolution.url;
            return instagramObject;
          });

          var flickrObjects;
          var thirtyDaysAgo = (Date.now() / 1000) - (60 * 60 * 24 * 30);
          $.ajax({
            url:  "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=013a3a4a679d634b6f2114ceb152a22e&tags=dctech&min_upload_date=" + thirtyDaysAgo + "&format=json&nojsoncallback=1",
            dataType: 'json',
            cache: false,
            async: false,
            complete: function(xhr, textStatus) {
              if (xhr.status == 200) {
                flickrObjects = JSON.parse(xhr.responseText).photos.photo;
                // make another ajax request to the photos.comments.getlist
                if(flickrObjects.length > 0 ) {
                  flickrObjects = _.map(flickrObjects, function(flickrObject) {
                    $.ajax({
                      url: "https://api.flickr.com/services/rest/?method=flickr.photos.comments.getList&api_key=013a3a4a679d634b6f2114ceb152a22e&photo_id=" + flickrObject.id +  "&format=json&nojsoncallback=1",
                      cache: false,
                      async: false,
                      complete: function(xhr, textStatus) {
                        if(JSON.parse(xhr.responseText).comments.length === undefined) {
                          var numberOfComments = 0;
                          flickrObject.comments = {count: numberOfComments};
                        }
                        else {
                          var numberOfComments = JSON.prase(xhr.responseText).comments;
                          flickrObject.comments = {count: numberOfComments};
                        }
                        flickrObject.url = "https://farm" + flickrObject.farm + ".staticflickr.com/" + flickrObject.server +  "/" + flickrObject.id + "_" + flickrObject.secret +  ".jpg";
                      }
                    });
                    return flickrObject;
                  });
                }
              } else {
                console.log(xhr.status)
              }
            },
          });
          var allObjects = flickrObjects.concat(allInstagramObjects);
          var sorted_data = _.sortBy(allObjects, function(object){
            return object.comments.count;
          });
          sorted_data = sorted_data.reverse();
          this.setState({data: sorted_data });
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
    this.getAllData(this.props.url, this.state.data);
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
    var pictureNodes = this.props.data.map(function (object) {
      return (
        <Picture url={object.url} commentCount={object.comments.count} comments={object.comments}/>
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
  componentDidMount: function () {
    var element = this.getDOMNode();
    $(element).find('.comment-content').hide()
    $(element).hover(function(){
      $(this).find('img').css('opacity', '0.7');
      $(this).find('.comment-content').show();
    }, function(){
      $(this).find('.comment-content').hide();
      $(this).find('img').css('opacity', '1.0');
    });
  },
  render: function() {
    return (
      <div className="picture">
      <img className="grid-item" src={this.props.url} />
        <div className="comment-content" data-comment-count={this.props.commentCount} data-comments={this.props.comments}>
          {this.props.commentCount}
        </div>
      </div>

    );
  }
});

React.render(
  <PictureBox url='https://api.instagram.com/v1/tags/dctech/media/recent?client_id=fcd848752dbb44bebe0143378aa2142c' />,
  document.getElementById("content")
);
