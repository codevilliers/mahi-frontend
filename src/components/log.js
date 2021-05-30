import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ToastContainer, toast } from 'material-react-toastify'
import 'material-react-toastify/dist/ReactToastify.css'

import PropTypes from 'prop-types'
import SwipeableViews from 'react-swipeable-views'
import { makeStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Card from '@material-ui/core/Card'
import {
  Avatar,
  Button,
  CardActions,
  Collapse,
  FormLabel,
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
  InputAdornment,
  SvgIcon,
  TextField,
  ThemeProvider
} from '@material-ui/core'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import SendIcon from '@material-ui/icons/Send'

import { theme } from '../theme'
import Comment from './comment'
import TimeAgo from 'react-timeago'
import { addActivity, addDonation } from '../actions/extraActions'
import { getMoreActivities } from '../actions/CauseActions'
import { isMobile } from 'react-device-detect'

function TabPanel (props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

function a11yProps (index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
}

const useStyles = makeStyles(theme => ({
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0rem'
    },
  },
  root: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  inputHidden: {
    display: 'none'
  },
  inputCard: {
    padding: '1rem',
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
    textAlign: '-webkit-center',
    justifyContent: 'space-between',
    border: 'none',
    boxShadow: 'none',
    height: '100%'
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)'
  },

  tabs: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
  },
  tab: {
    textTransform: 'none'
  },
  uploadErrorContainer: {
    fontSize: '0.75rem',
    marginTop: '0.2rem',
    color: '#f44336'
  },
  cards: {
    border: 'none',
    width: '100%',
    padding: '1rem 0'
  },
  expand: {
    textTransform: 'none',
    fontSize: '0.75rem'
  },
  justify_space: {
    justifyContent: 'space-around'
  },
  swipeableContainer: {
    width: '100%'
  },
  textfield: {
    width: '100%',
    bottom: '0'
  },
  tabPanel: {
    overflowX: 'hidden',
    marginBottom: '2rem'
  }
}))

const useCardStyles = makeStyles(theme => ({
  rootMobile: {
    width: '100%',
    marginTop: '0.5rem',
    borderRadius: '0.5rem',
    marginBottom: '0.5rem',
    padding: '0 1.25rem',
    boxSizing: 'border-box'
  },
  rootDesktop: {
    width: '100%',
    marginTop: '0.5rem',
    borderRadius: '0.5rem',
    marginBottom: '1.5rem',
    padding: '0 1.25rem',
    boxSizing: 'border-box'
  }
}))

function LogTabs () {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [value, setValue] = React.useState(0)
  const [activity_expanded, setActivityExpanded] = React.useState(false)
  const [donation_expanded, setDonationExpanded] = React.useState(false)
  const activeCause = useSelector(state => state.causes.activeCause)
  const logged_in_user = useSelector(state => state.auth.Loggedinuser)
  const [donation_media, setDonationMedia] = React.useState('')
  const [donation_description, setDonationDescription] = React.useState('')
  const causeDonations = activeCause.cause_donations
  const [donation_description_error, set_donation_description_error] = useState(
    null
  )
  const [donation_photo_error, set_donation_photo_error] = useState(null)
  const [activity, setActivity] = React.useState('')

  const validateUpload = () => {
    let err = false
    if (!donation_media || donation_media.length === 0) {
      set_donation_photo_error('Please upload proof of donation')
      err = true
    } else {
      set_donation_photo_error(null)
    }

    if (!donation_description) {
      set_donation_description_error('Describe in 3-4 words')
      err = true
    } else {
      set_donation_description_error(null)
    }

    return !err
  }

  const handleDonationSubmit = () => {
    if (validateUpload()) {
      let formdata = new FormData()
      formdata.append('description', donation_description)
      formdata.append('cause', activeCause.id)
      formdata.append('media', donation_media[0])
      dispatch(addDonation(formdata, handleSuccess))
    }
  }

  const handleSubmit = () => {
    let formdata = new FormData()
    formdata.append('description', activity)
    formdata.append('cause', activeCause.id)
    dispatch(addActivity(formdata, handleSuccess))
  }
  const handleSingleImageChange = e => {
    setDonationMedia(e.target.files)
  }
  const removeImage = name => {
    setDonationMedia([])
  }

  const handleSuccess = () => {
    setActivity('')
    setDonationDescription('')
    setDonationMedia('')
    toast.success('submitted successfully!', {
      position: toast.POSITION.BOTTOM_CENTER
    })
  }
  const handleActivityChange = e => {
    setActivity(e.target.value)
  }

  const donationsMedia =
    causeDonations &&
    causeDonations.map(donation => {
      return (
        <GridListTile
          key={donation.id}
          style={{ minHeight: '22.5vw', minWidth: '270px' }}
        >
          <img src={donation.media} alt='Media' />
          <GridListTileBar
            title={donation.description}
            classes={{
              root: classes.titleBar,
              title: classes.title
            }}
            actionIcon={
              <IconButton aria-label={`star ${donation.description}`}>
                <StarBorderIcon className={classes.title} />
              </IconButton>
            }
          />
        </GridListTile>
      )
    })

  const causeActivities =
    activeCause &&
    activeCause.cause_activities &&
    activeCause.cause_activities.map(activity => {
      return (
        <Comment
          key={activity.id}
          avatar={
            <Avatar
              src={
                activity.person.user.display_picture
                  ? activity.person.user.display_picture
                  : ''
              }
              // className={classes.avatar}
            >
              {activity.person.user.display_name
                ? activity.person.user.display_name[0]
                : 'User'}
            </Avatar>
          }
          title={activity.person.user.display_name}
          subtitle={<TimeAgo date={activity.created_on} />}
          content={activity.description}
        />
      )
    })

  const moreCauseActivities =
    activeCause &&
    activeCause.moreActivities &&
    activeCause.moreActivities.map(activity => {
      return (
        <Comment
          key={activity.id}
          avatar={
            <Avatar
              src={
                activity.person.user.display_picture
                  ? activity.person.user.display_picture
                  : ''
              }
              // className={classes.avatar}
            >
              {activity.person.user.display_name
                ? activity.person.user.display_name[0]
                : 'User'}
            </Avatar>
          }
          title={activity.person.user.display_name}
          subtitle={<TimeAgo date={activity.created_on} />}
          content={activity.description}
        />
      )
    })

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleChangeIndex = index => {
    setValue(index)
  }

  const handleActivityExpandClick = () => {
    !activity_expanded &&
      activeCause &&
      !activeCause.moreActivities &&
      dispatch(
        getMoreActivities(activeCause.id, () => {
          toast.error('Unable to load more activities.', {
            position: toast.POSITION.BOTTOM_CENTER
          })
        })
      )
    setActivityExpanded(!activity_expanded)
  }

  const handleDonationExpandClick = () => {
    setDonationExpanded(!donation_expanded)
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <div style={{ width: '100%' }}>
          <Tabs
            classes={{
              root: classes.tabs,
              centered: classes.justify_space
            }}
            value={value}
            onChange={handleChange}
            indicatorColor='secondary'
            textColor='secondary'
            centered
            aria-label='full width tabs example'
          >
            <Tab
              className={classes.tab}
              label='Donation Log'
              {...a11yProps(0)}
            />
            <Tab
              className={classes.tab}
              label='Activity Log'
              {...a11yProps(1)}
            />
          </Tabs>
        </div>
          <div className={classes.swipeableContainer}>
          <TabPanel value={value} index={0} dir={theme.direction} className={classes.tabPanel}>
            <GridList className={classes.gridList} cols={1}>
              <GridListTile key='0' style={{minHeight: '22.5vw', overflow: 'hidden'}}>
                <Card className={classes.inputCard}>
                  <FormLabel className={classes.formLabel}>
                    <div onClick={() => removeImage('needy_photo')}>
                      {donation_media[0] ? donation_media[0].name : ''}
                    </div>
                  </FormLabel>
                  <input
                    accept='image/*'
                    onChange={handleSingleImageChange}
                    name='donation_media'
                    className={classes.inputHidden}
                    id='contained-button-file-donation_media'
                    type='file'
                  />
                  <label htmlFor='contained-button-file-donation_media'>
                    <Button
                      variant='contained'
                      color='primary'
                      component='span'
                    >
                      {donation_media ? 'Update Donation' : 'Add Donation'}
                    </Button>
                    <div className={classes.uploadErrorContainer}>
                      {donation_photo_error}
                    </div>
                  </label>
                  <div className={classes.input}>
                    <TextField
                      className={classes.textfield}
                      onChange={e => setDonationDescription(e.target.value)}
                      value={donation_description}
                      name='donation'
                      id='standard-basic'
                      label='Write something'
                      error={donation_description_error ? true : false}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <SvgIcon onClick={handleDonationSubmit}>
                              <SendIcon />
                            </SvgIcon>
                          </InputAdornment>
                        )
                      }}
                    />
                  </div>
                  <div className={classes.uploadErrorContainer}>
                    {donation_description_error}
                  </div>
                </Card>
              </GridListTile>
              {donationsMedia}
            </GridList>
          </TabPanel>

          <TabPanel value={value} index={1} dir={theme.direction}>
            {activeCause &&
              logged_in_user &&
              activeCause.associated_volunteers &&
              activeCause.associated_volunteers
                .map(volunteer => volunteer.user.id)
                .includes(logged_in_user.id) && (
                <div className={classes.input}>
                  <TextField
                    className={classes.textfield}
                    onChange={handleActivityChange}
                    value={activity}
                    name='activity'
                    id='standard-basic'
                    label='Give brief activity'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <SvgIcon onClick={handleSubmit}>
                            <SendIcon />
                          </SvgIcon>
                        </InputAdornment>
                      )
                    }}
                  />
                </div>
              )}
            {causeActivities}
            <CardActions style={{ justifyContent: 'center' }}>
              <Button
                className={classes.expand}
                onClick={handleActivityExpandClick}
              >
                {`View ${activity_expanded ? 'less ' : 'all '}activity`}
              </Button>
            </CardActions>
            <Collapse in={activity_expanded} timeout='auto' unmountOnExit>
              {moreCauseActivities}
            </Collapse>
          </TabPanel>
        <ToastContainer />
      </div>
      </div>
    </ThemeProvider>
  )
}

export default function Log () {
  const classes = useCardStyles()

  return (
    <Card className={isMobile ? classes.rootMobile : classes.rootDesktop}>
      <LogTabs />
    </Card>
  )
}
