import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { updateLikedUserOnActiveCause } from '../actions/CauseActions'
import Typography from '@material-ui/core/Typography'
import ShowMoreText from 'react-show-more-text'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Button from '@material-ui/core/Button'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import { red } from '@material-ui/core/colors'
import {
  Avatar,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  IconButton,
  LinearProgress,
  SvgIcon,
  ThemeProvider,
  withStyles
} from '@material-ui/core'
import {
  PostCardFooterFavLeftIconDetail,
  PostCardFooterFavRightIcon,
  PostCardFooterShareIcon
} from '../icons/menu'
import { useParams } from 'react-router-dom'
import { getCause } from '../actions/CauseActions'
import { isMobile } from 'react-device-detect'

const useStyles = makeStyles(theme => ({
  rootMobile: {
    width: '100%',
    borderRadius: '0.5rem',
    paddingBottom: '0.8rem',
    marginBottom: '0.5rem'
  },
  rootDesktop: {
    width: '100%',
    borderRadius: '0.5rem',
    paddingBottom: '0.8rem',
    marginBottom: '1.5rem'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default
  },
  arrowIcon: {
    fontSize: '2.5rem',
    color: 'white'
  },
  stepper: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'absolute',
    top: '40%',
    width: '100%'
  },
  LikeIcon: {
    marginLeft: 'auto'
  },
  PostCardDescription: {
    display: 'flex',
    width: 'auto',
    padding: '0.5rem 1.25rem',
    alignItems: 'center'
  },
  PostCardBottom: {
    display: 'flex',
    width: 'auto',
    padding: '0.5rem 1.25rem',
    fontSize: '0.8rem',
    alignItems: 'center'
  },
  PostCardBottomDetailRight: {
    width: '20%',
    display: 'flex',
    flexDirection: 'column',
    placeItems: 'flex-end'
  },
  PostCardBottomDetailLeft: {
    width: '20%',
    display: 'flex',
    flexDirection: 'column'
  },
  steps: {
    position: 'absolute',
    top: '10%',
    left: '80%',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    background: 'top',
    height: '1.6rem',
    borderRadius: '0.3rem',
    fontSize: '0.8rem',
    padding: '0.2rem 0.4rem'
  },
  img: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    position: 'relative',
    backgroundSize: 'contain'
  },
  mediaDiv: {
    background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%,  rgba(0, 0, 0, 0.1)100%);',
    height: '-webkit-fill-available',
    width: '100%',
    position: 'absolute',
    top: 0
  },
  avatar: {
    backgroundColor: red[500],
    height: '3rem',
    width: '3rem'
  },
  subheader: {
    display: 'flex',
    alignItems: 'center'
  },
  subheader_icon: {
    display: 'flex',
    fontSize: '1.0rem'
  },
  subheader_text: {
    display: 'flex',
    alignItems: 'start'
  },
  cardHeaderTitle: {
    fontSize: '18px',
    fontWeight: 500
  }
}))

const BorderLinearProgress = withStyles(theme => ({
  root: {
    height: 8,
    borderRadius: 5,
    width: '70%'
  },
  colorPrimary: {
    backgroundColor: '#F2F0FF'
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#6552FF'
  }
}))(LinearProgress)

export default function PostDetailCard (cause) {
  const classes = useStyles()
  const theme = useTheme()
  const [activeStep, setActiveStep] = React.useState(0)
  const activeCause = useSelector(state => state.causes.activeCause)
  const maxSteps = activeCause.id ? activeCause.benchmark_media.length : ''
  const [expand, setExpand] = useState(false)
  const onClick = () => {
    setExpand(!expand)
  }

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }
  const user = useSelector(state => state.auth.Loggedinuser)

  const percentage = (activeCause.raised / activeCause.goal) * 100
  const dispatch = useDispatch()
  const [liked_by, setLikedBy] = useState(
    user &&
      user.id &&
      activeCause.liked_by &&
      activeCause.liked_by.includes(user.id)
  )
  const [supporterCount, setSupporterCount] = useState(activeCause.supporter_count)
  const handleLikeClick = () => {
    dispatch(updateLikedUserOnActiveCause(activeCause.id))
    liked_by
      ? setSupporterCount(supporterCount - 1)
      : setSupporterCount(supporterCount + 1)
    setLikedBy(!liked_by)
  }
  return (
    <Card className={isMobile ? classes.rootMobile : classes.rootDesktop}>
      <ThemeProvider theme={theme}>
        {isMobile ? (
          ''
        ) : (
          <CardHeader
            avatar={
              <Avatar
                src={
                  activeCause.needy_photo
                    ? activeCause.needy_photo
                    : ''
                }
                className={classes.avatar}
              >
                {activeCause.needy_name[0]}
              </Avatar>
            }
            title={activeCause.needy_name}
            classes={{
              title: classes.cardHeaderTitle
            }}
            subheader={
              <div className={classes.subheader}>
                <div>
                  <LocationOnIcon className={classes.subheader_icon} />
                </div>
                <div className={classes.subheader_text}>
                  {activeCause.needy_address}
                </div>
              </div>
            }
          />
        )}
        <CardMedia
          className={classes.img}
          image={
            activeCause.id
              ? activeCause.benchmark_media[activeStep].media
              : ''
          }
          alt='benchmark data'
        >
          <div className={classes.mediaDiv}>
            <div className={classes.steps}>
              {activeStep + 1}/{maxSteps}
            </div>
            <div className={classes.stepper}>
              <Button
                size='small'
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowRight className={classes.arrowIcon} />
                ) : (
                  <KeyboardArrowLeft className={classes.arrowIcon} />
                )}
              </Button>
              <Button
                size='small'
                onClick={handleNext}
                disabled={activeStep === maxSteps - 1}
              >
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowLeft className={classes.arrowIcon} />
                ) : (
                  <KeyboardArrowRight className={classes.arrowIcon} />
                )}
              </Button>
            </div>
          </div>
        </CardMedia>
        <CardActions disableSpacing>
          <IconButton>
            <SvgIcon>
              <PostCardFooterFavLeftIconDetail />
            </SvgIcon>
          </IconButton>
          <p>{supporterCount} Supporters</p>
          <IconButton className={classes.LikeIcon} onClick={handleLikeClick}>
            {liked_by ? (
              <FavoriteIcon style={{ fill: '#FC747A' }} />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
          <IconButton>
            <SvgIcon>
              <PostCardFooterShareIcon />
            </SvgIcon>
          </IconButton>
        </CardActions>
        <div className={classes.PostCardDescription}>
          <Typography variant='body2' color='textPrimary' component='div'>
            {activeCause.description}
          </Typography>
        </div>
        <div className={classes.PostCardBottom}>
          <div className={classes.PostCardBottomDetailLeft}>
            <div>₹{activeCause.raised}</div>
            <div>RAISED</div>
          </div>
          <BorderLinearProgress variant='determinate' value={percentage} />
          <div className={classes.PostCardBottomDetailRight}>
            <div>₹{activeCause.goal}</div>
            <div>GOAL</div>
          </div>
        </div>
      </ThemeProvider>
    </Card>
  )
}
