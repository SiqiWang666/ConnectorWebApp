import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { removeComment } from '../../actions/post';

const CommentItem = ({
    auth,
    postId,
    comment: {_id, text, name, avatar, user, date},
    removeComment
}) => {
    return (
        <div class="post bg-white p-1 my-1">
          <div>
            <Link to={`/profile/${user}`}>
              <img
                class="round-img"
                src={avatar}
                alt=""
              />
              <h4>{name} </h4>
            </Link>
          </div>
          <div>
            <p class="my-1">{text} 
            </p>
             <p class="post-date">
                Posted on <Moment format='MM/DD/YYYY'>{date}</Moment>
            </p>
            {!auth.loading && user === auth.user._id && (
                <button onClick={e => removeComment(postId, _id)} type="button" className='btn btn-danger'>
                    <i className="fas fa-times" />
                </button>
            )}
          </div>
        </div>
    )
}

CommentItem.propTypes = {
    comment: PropTypes.object.isRequired,
    postId: PropTypes.number.isRequired,
    auth: PropTypes.object.isRequired,
    removeComment: PropTypes.func.isRequired
}
// Auth state is used to filter comments belong to current user.
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps, {removeComment})(CommentItem);
