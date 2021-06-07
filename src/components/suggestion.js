import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ToastContainer, toast } from 'material-react-toastify'
import 'material-react-toastify/dist/ReactToastify.css'

import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import SendIcon from '@material-ui/icons/Send'

import Avatar from '@material-ui/core/Avatar'
import Comment from './comment'
import {
  Button,
  CardActions,
  Collapse,
  InputAdornment,
  SvgIcon,
  TextField
} from '@material-ui/core'
import TimeAgo from 'react-timeago'
import { addSuggestion } from '../actions/extraActions'
import { getMoreSuggestions } from '../actions/CauseActions'
import { isMobile } from 'react-device-detect'

const useStyles = makeStyles({
  root: {
    width: '100%',
    marginTop: '1rem',
    borderRadius: '0.5rem',
    marginBottom: '0.5rem',
    padding: '1rem 1.25rem 0 1.25rem',
    boxSizing: 'border-box'
  },
  headerDesktop: {
    fontSize: '1.5em',
    marginTop: '1.75em',
    marginBottom: '1.25em',
    fontWeight: 500,
    textAlign: 'center'
  },
  headerMobile: {
    fontSize: '1.25em',
    marginTop: '0.75em',
    fontWeight: 500,
    textAlign: 'center'
  },
  expand: {
    textTransform: 'none',
    fontSize: '0.75rem'
  },
  textfield: {
    width: '100%',
    fontSize: '14px'
  }
})

export default function Suggestions () {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [suggestions_expanded, setSuggestionsExpanded] = React.useState(false)
  const [suggestion, setSuggestion] = React.useState('')
  const activeCause = useSelector(state => state.causes.activeCause)
  const user = useSelector(state => state.auth.Loggedinuser)
  const handleSubmitClick = () => {
    user && user.id
      ? handleSubmit()
      : toast.error('Login to submit a suggestion', {
          position: toast.POSITION.BOTTOM_CENTER
        })
  }
  const handleSubmit = () => {
    let formdata = new FormData()
    formdata.append('description', suggestion)
    formdata.append('cause', activeCause.id)
    dispatch(addSuggestion(formdata, handleSuccess))
  }

  const handleSuccess = () => {
    setSuggestion('')
    toast.success('suggestion submitted succesfully!', {
      position: toast.POSITION.BOTTOM_CENTER
    })
  }

  const handleChange = e => {
    setSuggestion(e.target.value)
  }

  const handleSuggestionExpandClick = () => {
    !suggestions_expanded &&
      activeCause &&
      !activeCause.moreSuggestions &&
      dispatch(
        getMoreSuggestions(activeCause.id, () => {
          toast.error('Unable to load more suggestion.', {
            position: toast.POSITION.BOTTOM_CENTER
          })
        })
      )
    setSuggestionsExpanded(!suggestions_expanded)
  }

  const causeSuggestions =
    activeCause &&
    activeCause.cause_suggestions &&
    activeCause.cause_suggestions.map(suggestion => {
      return (
        <Comment
          key={suggestion.id}
          avatar={
            <Avatar
              src={
                suggestion.person.display_picture
                  ? suggestion.person.display_picture
                  : ''
              }
              className={classes.avatar}
            >
              {suggestion.person.display_name[0]}
            </Avatar>
          }
          title={suggestion.person.display_name}
          subtitle={<TimeAgo date={suggestion.created_on} />}
          content={suggestion.description}
        />
      )
    })

  const moreSuggestions =
    activeCause &&
    activeCause.moreSuggestions &&
    activeCause.moreSuggestions.map(suggestion => {
      return (
        <Comment
          key={suggestion.id}
          avatar={
            <Avatar
              src={
                suggestion.person.display_picture
                  ? suggestion.person.display_picture
                  : ''
              }
              className={classes.avatar}
            >
              {suggestion.person.display_name[0]}
            </Avatar>
          }
          title={suggestion.person.display_name}
          subtitle={<TimeAgo date={suggestion.created_on} />}
          content={suggestion.description}
        />
      )
    })

  return (
    <React.Fragment>
      <Typography
        className={isMobile ? classes.headerMobile : classes.headerDesktop}
      >
        Suggestions
      </Typography>
      <Card className={classes.root}>
        <div className={classes.input}>
          <TextField
            className={classes.textfield}
            onChange={handleChange}
            value={suggestion}
            name='suggestion'
            id='standard-basic'
            label='Give brief suggestion'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <SvgIcon onClick={handleSubmitClick}>
                    <SendIcon />
                  </SvgIcon>
                </InputAdornment>
              )
            }}
          />
        </div>
        {causeSuggestions}
        <CardActions style={{ justifyContent: 'center' }}>
          <Button
            className={classes.expand}
            onClick={handleSuggestionExpandClick}
          >
            {`View ${suggestions_expanded ? 'less ' : 'all '}suggestions`}
          </Button>
        </CardActions>
        <Collapse in={suggestions_expanded} timeout='auto' unmountOnExit>
          {moreSuggestions}
        </Collapse>
      </Card>
      <ToastContainer />
    </React.Fragment>
  )
}
