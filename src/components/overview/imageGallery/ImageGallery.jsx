import React from 'react';
import ExpandedView from './ExpandedView.jsx'

class ImageGallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: this.props.photos,
      currentPhotoIndex: 0, // default is first image
      tbIndices: [0, 1, 2, 3, 4] // default 1 thumbnail
    }
    this.photoNavHandler = this.photoNavHandler.bind(this);
    this.tbNavHandler = this.tbNavHandler.bind(this);
    this.tbClick = this.tbClick.bind(this)
    this.mainPhotoClick = this.mainPhotoClick.bind(this);
    this.numThumbnails = 5;
  }
  componentDidMount() {
    // hide left arrow upon load (first image is default)
    this.setState({tbIndices: [...Array(this.numThumbnails).keys()] })
    if (this.state.currentPhotoIndex === 0) {
      document.getElementById("photo-nav-left").classList.add("hidden");
    }
  }

  componentDidUpdate(prevProps) {
    // render new product 
    let numTb = this.props.style.photos.length
    let tbIndices = numTb > this.numThumbnails ? [...Array(this.numThumbnails).keys()] : [...Array(numTb).keys()]
    if (prevProps.photos[0].url !== this.props.photos[0].url) {
      console.log('new product registered in ImageGallery')
      this.setState({
        photos: this.props.photos,
        currentPhotoIndex: 0,
        tbIndices: tbIndices
      }, () => {
        console.log('state', this.state.photos)
      })
    }
    // render new style 
    if (prevProps.style.style_id !== this.props.style.style_id) {
      console.log('new style registered in ImageGallery')
      this.setState({tbIndices: tbIndices, photos: this.props.photos })
    }

  }

  tbNavHandler(e) {
    let clickedNav = e.target.id;
    let newTopIndex;
    // when thumnail nav-down clicked
    if (clickedNav === 'tb-nav-down') {
      // new top thumnail is original index of top displayed minus 1
      newTopIndex = this.state.tbIndices[0] - 1;
    }
    // when thumnail nav-up clicked
    if (clickedNav === 'tb-nav-up') {
      // new top thumbnail is original index of top thumbnail plus 1
      newTopIndex = this.state.tbIndices[0] + 1;
    }
    // update thumbnails displayed
    this.calcTbDisplayed(newTopIndex)
  }

  photoNavHandler(e, index) {
    if (e) { // when photoNavHandler called upon photo nav button clicked
      // update state.currentPhotoIndex
      var clickedNav = e.target.id;
      if (clickedNav === 'photo-nav-right') { // right nav button was clicked
        var newPhotoIndex = this.state.currentPhotoIndex + 1;
        if (newPhotoIndex >= this.state.photos.length) { newPhotoIndex = 0 }
      }
      if (clickedNav === 'photo-nav-left' ) { // left nav button was clicked
        var newPhotoIndex = this.state.currentPhotoIndex - 1;
        if (newPhotoIndex < 0 ) { newPhotoIndex = this.state.photos.length - 1}
      }
    } else { // when photoNavHandler called upon thumbnail being clicked
      var newPhotoIndex = index
    }
    this.setState({
      currentPhotoIndex: newPhotoIndex
    }, () => {
      // hide/show nav button on main image when appropriate
      if (newPhotoIndex === 0) {
        document.getElementById("photo-nav-left").classList.add("hidden")
      }
      else if (newPhotoIndex === this.state.photos.length - 1) {
        document.getElementById("photo-nav-right").classList.add("hidden")
      }
      else {
        document.getElementById("photo-nav-left").classList.remove("hidden")
        document.getElementById("photo-nav-right").classList.remove("hidden")
      }
      // // if total num of thumbnails is greater than this.numThumbnails
      // if (this.photos.length > this.numThumnails) {
        // update displayed thumbnails when currentPhotoInd > bottomOriginalInd OR currentPhotoInd < topOriginalInd
        let topOriginalInd = this.state.tbIndices[0]; // original index of thumb at TOP
        let bottomOriginalInd = this.state.tbIndices[this.state.tbIndices.length - 1]; // original index of thumb at BOTTOM
        if (this.state.currentPhotoIndex >= bottomOriginalInd || this.state.currentPhotoIndex < topOriginalInd) {
          this.calcTbDisplayed(this.state.currentPhotoIndex); // update state.tbDisplayed
        }
      // }

    })
  }

// default view: thumbnail navigation
// calculates array of thumbnail indices to display; input: top tb index (see tbNavHandler)
calcTbDisplayed (index) {
  if (this.state.photos.length > this.numThumbnails) {
    let minIndex = index;
    let maxIndex = minIndex + this.numThumbnails - 1;
    let wrapIndex = 0;
    let tbIndices = [];
    for (let i = minIndex; i <= maxIndex; i++) {
      if (i >= 0 && i < this.state.photos.length) {
        tbIndices.push(i)
      } 
      if (i < 0) {
        tbIndices.push(this.state.photos.length + i)
      }
      if (i >= this.state.photos.length) {
        tbIndices.push(wrapIndex);
        wrapIndex++
      }
    }
    console.log('in calcTbDisplayed: ', tbIndices)
    this.setState({ tbIndices: tbIndices })
  }
}

tbClick(e) {
  let clickedTbIndex = Number(e.target.id);
  this.photoNavHandler(null, clickedTbIndex);
}

mainPhotoClick(e) {
  document.getElementById('gallery-overlay').style.display = 'block';
}

expandedClick(e) {
  document.getElementById('gallery-overlay').style.display='none';
}


  render() {

    return (
      <div>
      <div className="container">
      <div className="row align-items-center ml-4 mr-4">
        
        {/* thumbnails */}
        <div className="col-2 default-thumbnails">
          <div>
            <div className="row">
              <div className="col-12 d-flex align-items-center justify-content-center">
                {this.state.photos.length > this.numThumbnails ? <div id="tb-nav-up" onClick={this.tbNavHandler} className={"photo-nav"}>
                  <i class="material-icons md-34">arrow_drop_up</i>
                </div> : null}
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-12 d-flex align-items-center justify-content-center">
                <div>
                  { console.log('tbIndices: ', this.state.tbIndices)}
                  {
    
                    this.state.tbIndices.map((tbIndex, i) => {
                      let tbSelected = tbIndex === this.state.currentPhotoIndex ? "tb-div d-flex justify-content-center align-items-center tb-selected" : "tb-div d-flex justify-content-center align-items-center";
                      return (<div className={tbSelected} key={i}>
                                  <img id={tbIndex} onClick={this.tbClick} className={"default-view-tb"} src={this.state.photos[tbIndex].thumbnail_url}></img>
                              </div>)
                    })

                    // this.state.photos.slice(0, this.numThumbnails).map((photo, index) => {
                    //   let tbSelected = photo.originalIndex === this.state.currentPhotoIndex ? "tb-div d-flex justify-content-center align-items-center tb-selected" : "tb-div d-flex justify-content-center align-items-center";
                    //   return (<div className={tbSelected} key={index}>
                    //               <img id={photo.originalIndex} onClick={this.tbClick} className={"default-view-tb"} src={photo.thumbnail_url}></img>
                    //           </div>)
                    // })

                  }
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 d-flex align-items-center justify-content-center">
                {/* only show thumbnail navigation if there are more than this.numThumnails */}
                {this.state.photos.length > this.numThumbnails ? <div id="tb-nav-down" onClick={this.tbNavHandler} className={"photo-nav"}>
                  <i class="material-icons md-34">arrow_drop_down</i>
                </div> : null}
              </div>
            </div>
          </div>
        </div>

        {/* main image */}
        <div className="col-12">
          {
            this.state.photos.map((photo, i) => {
              let photoClass = i === this.state.currentPhotoIndex ?
                "d-flex default-view-photo-container align-items-center justify-content-center" : "hidden";
              return (
                <div key={i} className={photoClass}>
                  <img id="test" onClick={this.mainPhotoClick} className="default-view-photo img-fluid" src={photo.url}></img>
                </div>
              )
            })
          }
          <div id="photo-nav-left" onClick={this.photoNavHandler} className="photo-nav">
            <i class="material-icons">arrow_backward</i>
          </div>
          <div id="photo-nav-right" onClick={this.photoNavHandler} className="photo-nav">
            <i class="material-icons">arrow_forward</i>
          </div>
        </div>

      </div>
      </div>
      {/* expanded view overlay */}
      <div id="gallery-overlay">
        <div className="close-expanded-view nav-bg" onClick={this.expandedClick}>
        <i class="material-icons md-34">close</i>
        </div>
        <ExpandedView tbClick={this.tbClick} 
                      photos={this.state.photos} 
                      currentPhotoIndex={this.state.currentPhotoIndex} 
                      photoNavHandler={this.photoNavHandler}/>
      </div>
      </div>
    )
  }
}

export default ImageGallery