/* eslint-disable func-names */
import React from 'react';
import axios from 'axios';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Link } from 'react-router-dom';
import Songs from './Songs.jsx';
import Lyrics from './Lyrics.jsx';

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPlaylist: '',
      playerDisplay: false,
      description: '',
      playlistId: 0,
      playlistSongs: [],
      uri: '',
      clickedSong: {},
    };
    this.displayClickedSong = this.displayClickedSong.bind(this);
    this.getSongs = this.getSongs.bind(this);
  }

  componentDidMount() {
    if (this.props.location.state.playlist) {
      this.setState({
        currentPlaylist: this.props.location.state.playlist.name,
        description: this.props.location.state.playlist.description,
        playlistId: this.props.location.state.playlist.id,
      }, () => {
        this.getSongs();
      });
    }
  }

  getSongs() {
    const { playlistId } = this.state;

    axios.get(`/api/playlist/songs/${playlistId}`)
      .then(data => this.setState({
        playlistSongs: data.data,
      }));
  }

  displayClickedSong(song) {
    const { playerDisplay } = this.state;
    const { uri } = song;

    this.setState({
      playerDisplay: true,
      uri: uri.replace('spotify:track:', ''),
      clickedSong: song,
    });
  }

  render() {
    const {
      currentPlaylist, description, playerDisplay, playlistSongs, uri, clickedSong,
    } = this.state;

    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/main">
              Home
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={{
              pathname: '/createplaylist',
              state: {
                id_user: this.props.location.state.id_user,
                username: this.props.location.state.username,
              },
            }}
            >
                Create playlist
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={{
              pathname: '/search',
              state: {
                id_user: this.props.location.state.id_user,
                username: this.props.location.state.username,
              },
            }}
            >
                Search
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={{
              pathname: '/playlists',
              state: {
                id_user: this.props.location.state.id_user,
                username: this.props.location.state.username,
              },
            }}
            >
                Playlists
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={{
              pathname: '/friends',
              state: {
                id_user: this.props.location.state.id_user,
                username: this.props.location.state.username,
              },
            }}
            >
                Friends
            </Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Jumbotron style={{ textAlign: 'center', background: 'orange' }}>
          <h1 style={{ color: 'white' }}>{currentPlaylist}</h1>
          <p style={{ color: 'white' }}>{description}</p>
        </Jumbotron>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {playlistSongs.map(song => <Songs key={song.id} song={song} display={this.displayClickedSong} />)}
          </div>
          <div style={{ marginLeft: 200 }}>
            {playerDisplay
              ? (
                <div>
                  <iframe src={`https://open.spotify.com/embed/track/${uri}`} width="300" height="380" frameBorder="0" allowTransparency="true" allow="encrypted-media" />
                </div>
              )
              : null}
          </div>
        </div>
        {playerDisplay ? 
          <Lyrics queryData={clickedSong} />
          : null}
      </div>
    );
  }
}

export default Playlist;
