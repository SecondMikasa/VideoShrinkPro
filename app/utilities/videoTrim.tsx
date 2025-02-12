import { useEffect, useState } from 'react';
import { motion } from 'framer-motion'

import { UtilitiesSettings } from "@/utils/metadata";

import { VideoSlider } from './ui/videoSlider';
import { calculateTimeInHoursMinutesSeconds } from '@/utils/timeConverter';

type VideoTrimProps = {
    videoSettings: UtilitiesSettings;
    onVideoSettingsChange: (value: UtilitiesSettings) => void;
    disabled: boolean
}

const VideoTrim = ({
    videoSettings,
    onVideoSettingsChange,
    disabled,
}: VideoTrimProps) => {

    const [videoEndTime, setVideoEndTime] = useState(0)

    const { customStartTime, customEndTime } = videoSettings

    const startTime = calculateTimeInHoursMinutesSeconds(customStartTime)
    const endTime = calculateTimeInHoursMinutesSeconds(customEndTime)

    useEffect(() => {

        const video = document.getElementById("compress-video-player") as HTMLVideoElement

        if (video) {
            const handleLoadedMetadata = () => {
                const durationInSeconds = video.duration
                onVideoSettingsChange({
                    ...videoSettings,
                    customEndTime: durationInSeconds
                })
                setVideoEndTime(durationInSeconds)
            }

            video.addEventListener("loadedmetadata", handleLoadedMetadata)

            return () => {
                video.removeEventListener("loadedmetadata", handleLoadedMetadata)
            }
        }


    }, [])

    return (
        <motion.div
            className='rounded-2xl px-4 py-3 h-fit bg-gray-100 border border-gray-200'
        >
            <div
                className='text-sm'
            >
                <div
                    className='flex justify-between items-center border-b mb-2 pb-2'
                >
                    <p>
                        Trim Video
                    </p>
                </div>
                <div
                    className='flex justify-between items-center border-b mb-2 pb-2'
                >
                    <VideoSlider
                        disabled={disabled}
                        value={[customStartTime, customEndTime]}
                        max={videoEndTime}
                        step={1}
                        className='w-full'
                        onValueChange={(value: number[]) => {
                            const [startTime, endTime] = value
                            onVideoSettingsChange({
                                ...videoSettings,
                                customEndTime: endTime,
                                customStartTime: startTime
                            })
                        }}
                    />
                </div>
                <div className='flex justify-between'>
                    <div>
                        <p className='text-gray-500'>Start Time</p>
                        <p className='font-medium'> {startTime} </p>
                    </div>
                    <div>
                        <p className='text-gray-500'>End Time</p>
                        <p className='font-medium'> {endTime} </p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default VideoTrim