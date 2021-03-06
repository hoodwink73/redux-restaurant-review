import React, {Component, PropTypes} from 'react'
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import calculateStars from './calculateStars'
import findFeaturedRestaurant from './findFeaturedRestaurant'
import {addReview} from './actions.js'

/*
<FeaturedRestaurantInfo {...featuredRestaurant}/>
<DisplayReviews />
<ComposeReview />
{
  featuredRestaurant.reviews.map( review => {
    <li key={review.user}>
      <div>
        <h3>Comment: {review.comment}</h3>
        <h5>{review.user} {review.date}</h5>
      </div>
    </li>
  })
}
*/

class RestaurantFullPageContainer extends Component {
  constructor(props){
  	super(props)
  	this.state = {
      name: '',
      comment: '',
      stars: ''
    }
    this.onNameChange = this.onNameChange.bind(this)
    this.onCommentChange = this.onCommentChange.bind(this)
    this.onRatingChange = this.onRatingChange.bind(this)
    this.onReviewSubmit = this.onReviewSubmit.bind(this)
  }
  onNameChange(synthEvent){
    this.setState({name: synthEvent.target.value})
  }
  onCommentChange(synthEvent){
    this.setState({comment: synthEvent.target.value})
  }
  onRatingChange(synthEvent){
    this.setState({stars: synthEvent.target.value})
  }
  onReviewSubmit(synthEvent){
    synthEvent.preventDefault()

    const {dispatch, featuredRestaurant} = this.props
    const {place_id: placeID} = featuredRestaurant
    const {name, comment, stars} = this.state
    const date = 'today'

    dispatch(addReview(comment, date, stars, name, placeID))

    this.nameField.value = ''
    this.commentField.value = ''
    this.ratingField.value = ''
  }
  render() {
    const {featuredRestaurant} = this.props
    let stars
    if (featuredRestaurant) {
      stars = calculateStars(featuredRestaurant)
    }

    return (
      <div>
        {
          featuredRestaurant ?
          (
            <div>
              <div>
                <h1> Featured Restaurant: {featuredRestaurant.name}</h1>
                <span> {featuredRestaurant.address[0]} <br/>
                       {featuredRestaurant.address[1]} </span>
                <img src="/images/ChIJ3TH9CwFZwokRIvNO1SP0WLg.jpg" />
                <h3> Stars: {stars}</h3>
                <h3>Reviews:</h3>
                <ol>
                  {featuredRestaurant.reviews.map( review => {
                    return(
                      <li key={review.user}>
                        <div>
                          <h4>{review.user}</h4>
                          <p>{review.comment}</p>
                          <span>Rating: {review.rating}</span>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </div>
              <div>
                <form>
                  <h2> Write Your Own Review</h2>
                  <label htmlFor="name">Name:</label><br/>
                  <input type="text"
                         id="name"
                         onChange={this.onNameChange}
                         ref={(node)=> this.nameField = node}
                  /><br/>

                  <label htmlFor="comment">Comment:</label><br/>
                  <input type="text"
                         id="comment"
                         onChange={this.onCommentChange}
                         ref={(node) => this.commentField = node }
                  /><br/>

                  <label htmlFor="rating">{'Rating (1-5)'}:</label><br/>
                  <input type="number"
                         id="rating"
                         onChange={this.onRatingChange}
                         ref={(node) => this.ratingField = node}
                  /><br/>


                  <button type="submit" onClick={this.onReviewSubmit}>
                    submit review
                  </button>
                </form>
              </div>
            </div>
          ) :
          'No Featured Restaurant'
        }
      </div>
    )
  }
}

const mapStateToRestaurantFullPageContainerProps = (
  {
    restaurants
  },
  {
  params: {
    placeID
  }
}) =>
  {
    return {
      featuredRestaurant: findFeaturedRestaurant(restaurants, placeID)
    }
  }


const RestaurantFullPageSuperContainer = connect(
  mapStateToRestaurantFullPageContainerProps
)(
  withRouter(RestaurantFullPageContainer)
)

export default RestaurantFullPageSuperContainer
