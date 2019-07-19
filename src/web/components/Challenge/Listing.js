import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import Error from '../UI/Error';

const ChallengeListing = ({ error, loading, challenges }) => {
  // Error
  if (error) return <Error content={error} />;

  // Build Cards for Listing
  const cards = challenges.map(item => (
    <Card key={`${item.id}`}>
      <Link to={`/challenge/${item.id}`}>
        <CardImg top src={item.image} alt={item.title} />
      </Link>
      <CardBody>
        <CardTitle>{item.title}</CardTitle>
        <CardText>{item.body}</CardText>
        <Link className="btn btn-primary" to={`/challenge/${item.id}`}>
          View Challenge
          {' '}
          <i className="icon-arrow-right" />
        </Link>
      </CardBody>
    </Card>
  ));

  // Show Listing
  return (
    <div>
      <Row className="pt-4 pt-sm-0">
        <Col sm="12">
          <h1>Challenges</h1>
          <p>The following data is read directly from Firebase.</p>
        </Col>
      </Row>
      <Row className={loading ? 'content-loading' : ''}>
        <Col sm="12" className="card-columns">{cards}</Col>
      </Row>
    </div>
  );
};

ChallengeListing.propTypes = {
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  challenges: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

ChallengeListing.defaultProps = {
  error: null,
};

export default ChallengeListing;
