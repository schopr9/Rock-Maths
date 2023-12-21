import Lottie from 'lottie-react';
import levelUp from '../../assets/lottie/level-up.json';
import React, { useEffect, useState, useRef } from 'react';
import logic from '../../logic/logic';
import Canvas from './Canvas';

import {
    Flex,
    useColorModeValue,
    HStack,
    VStack,
    Text,
    Spacer,
    Fade,
    Progress,
    Collapse,
    Button,
    Badge,
    useBoolean,
    SlideFade,
} from '@chakra-ui/react';
import { ArrowForwardIcon, CheckIcon, SmallCloseIcon } from '@chakra-ui/icons';

export default function Draw() {
    const [success, setSuccess] = useBoolean();
    const [incorrect, setIncorrect] = useBoolean();
    const [levelDone, setLevelDone] = useBoolean();
    const [hint, setHint] = useBoolean();
    const inputRef = useRef(null);
    const clearCanvas = useRef(null);

    const [quiz, setQuiz] = useState({
        level: '1',

        skill: {
            add: '0.1',
            subtract: '0.1',
            multiply: '0.1',
            divide: '0.1'
        },

        skillStatus: {
            add: false,
            subtract: false,
            multiply: false,
            divide: false
        },

        combo: {
            status: false,
            mulitplier: 0
        },

        question: ['a'],
        answerCorrect: 'a',
        answerDisplay: 'Ready?',
        totalSteps: 26,

        history: [
            {
                stepNumber: 1,
                question: [''],
                answerCorrect: ''
            }
        ]
    });

    function updateQuiz(keyPress) {
        // new quiz is created
        const newQuiz = logic(quiz, keyPress);

        console.log(`
        newQuiz level ${newQuiz.level}
        quizlevel: ${quiz.level}
        quizcombo: ${quiz.combo.mulitplier}`);

        if (newQuiz.level !== quiz.level) {
            setLevelDone.on();
            setQuiz(newQuiz);
        }
        //check if a new quiz is created
        else if (newQuiz.history.length !== quiz.history.length) {
            setSuccess.on();
            setIncorrect.off();
            setHint.off();
            setTimeout(() => {
                setQuiz(newQuiz);
            }, 800);
        } else if (quiz.answerDisplay.length >= quiz.answerCorrect.length) {
            setIncorrect.on();
            //reset the combo mulitplier
            newQuiz.combo.status = false;
            newQuiz.combo.mulitplier = 0;
            setQuiz(newQuiz);
        } else {
            setIncorrect.off();
            setHint.off();
            setQuiz(newQuiz);
        }

        if (clearCanvas?.current) {
            clearCanvas.current.clearCanvas();
        }
    }

    const handleUpgradeLevel = () => {
        setLevelDone.off();
        updateQuiz();
    };

    useEffect(() => {
        // eslint-disable-next-line
        setSuccess.off();
    }, [quiz.history, setSuccess]);

    //set focus back to the main flex div so that the keyboard input is automatically detected
    useEffect(() => {
        inputRef.current.focus();
    }, [quiz]);

    const progress = (quiz.history.length / quiz.totalSteps) * 100;
    const levelCleared = levelDone;

    const answerTextColor = useColorModeValue(success && 'green.500', success && 'green.400');
    const questionColor = useColorModeValue('gray.700', 'gray.300');

    /* 
        !!! New Feature 
        -> If the level is cleared
     */

    return (
        <Flex
            minH="calc(100vh - 3.5rem)"
            align={'center'}
            justify={'center'}
            bgGradient={useColorModeValue(
                'linear(to-br, #faaca8,#ddd6f3)',
                'linear(to-br, #c33764,#1d2671)'
            )}
            tabIndex={0}
            ref={inputRef}
            onKeyDown={(event) => updateQuiz(event.key)}
        >
            <VStack minH={'90vh'}>
                {/* Progress Bar */}
                {!levelCleared && (
                    <VStack>
                        <HStack w="100%">
                            {/* // Combo badge ---> need to implement a combo tracker */}
                            {!levelCleared && (
                                <Collapse in={quiz.combo.mulitplier >= 3} >
                                    <Badge
                                        fontSize="0.6rem"
                                        rounded={'md'}
                                        variant="outline"
                                        p={1}
                                        colorScheme="pink"
                                    >
                                        {`🚀 Combo x${quiz.combo.mulitplier}`}
                                    </Badge>
                                </Collapse>
                            )}
                        </HStack>
                        <VStack
                            rounded={'lg'}
                            bg={'whiteAlpha.700'}
                            boxShadow={'lg'}
                            minW={'60'}
                            p={3}
                            gap={2}
                        >
                            <HStack w={'100%'} justifyContent={'space-between'}>
                                <Text fontWeight={'semibold'} fontSize={'xs'} color={'gray.700'}>
                                    {`Level ${quiz.level}`}
                                </Text>

                                <Text fontWeight={'semibold'} fontSize={'xs'} color={'gray.700'}>
                                    {`${quiz.history.length} of ${quiz.totalSteps}`}
                                </Text>
                            </HStack>
                            <Progress
                                w={56}
                                size="sm"
                                colorScheme={success ? 'green' : 'pink'}
                                value={progress}
                                hasStripe
                                isAnimated
                            />
                        </VStack>
                        <HStack w={'100%'}>
                            <Collapse in={incorrect} >
                                <Button
                                    size={'xs'}
                                    fontSize="0.6rem"
                                    rounded={'md'}
                                    onClick={() => setHint.toggle()}
                                >
                                    Hint
                                </Button>
                            </Collapse>
                            <SlideFade
                                color={answerTextColor}
                                in={hint}
                                offsetX="-20px"
                                offsetY="0px"
                                
                            >
                                <Text
                                    fontSize={'0.8rem'}
                                    fontWeight={'semibold'}
                                >{`${quiz.answerCorrect}`}</Text>
                            </SlideFade>
                            <Spacer />
                            <Collapse in={incorrect} >
                                <Badge
                                    fontSize="0.6rem"
                                    rounded={'md'}
                                    variant="subtle"
                                    p={1}
                                    colorScheme="red"
                                >
                                    <SmallCloseIcon /> Incorrect
                                </Badge>
                            </Collapse>
                            <Collapse in={success} >
                                <Badge
                                    fontSize="0.6rem"
                                    rounded={'md'}
                                    variant="subtle"
                                    p={1}
                                    colorScheme="green"
                                >
                                    <CheckIcon /> Correct
                                </Badge>
                            </Collapse>
                        </HStack>
                    </VStack>
                )}
                {!levelCleared && <Spacer />}

                {/* Question */}
                {!levelCleared && (
                    <Fade in transition={{ enter: { duration: 0.5, delay: 1 } }}>
                        <Text fontSize={'5xl'} color={questionColor} textAlign="center" fontFamily={"cursive"}>
                            {quiz.question}
                        </Text>
                    </Fade>
                )}
                {/* Answer */}
                <Spacer />
                {!levelCleared && (
                    <Fade in transition={{ enter: { duration: 0.5 } }}>
                        {/*/ how to trigger the canvas to clear */}

                        <Canvas ref={clearCanvas} />
                        <HStack justifyContent={'end'}>
                        <Button
                                rightIcon={<ArrowForwardIcon />}
                                colorScheme="purple"
                                variant="solid"
                                onClick={updateQuiz}
                            >
                                Next
                        </Button>
                            </HStack>
                    </Fade>
                )}

                {/* Can be turned into a modal if needed */}
                {levelCleared && (
                    <Fade in={levelCleared} transition={{ enter: { duration: 1 } }}>
                        <Text
                            align="center"
                            fontWeight={'semibold'}
                            fontSize={'3xl'}
                        >{`Good Job, Olivia! 👏`}</Text>
                        <Lottie animationData={levelUp} loop={true} style={{ width: 300 }} />
                        <Text align="center" fontSize={'xl'}>{`Level Complete`}</Text>
                    </Fade>
                )}
                <Spacer />
                {/* Hide the toggle button if the display is on mobile */}
                {/* Action */}
                {levelCleared && (
                    <Fade in={levelCleared} transition={{ enter: { delay: 1, duration: 0.5 } }}>
                        <HStack
                            rounded={'lg'}
                            bg={'whiteAlpha.600'}
                            boxShadow={'lg'}
                            minW={'60'}
                            p={3}
                            gap={2}
                        >
                            <Text color={'blackAlpha.800'} fontWeight={'semibold'}>
                                {`Next Round`}
                            </Text>
                            <Spacer />
                            <Button
                                rightIcon={<ArrowForwardIcon />}
                                colorScheme="purple"
                                variant="solid"
                                onClick={handleUpgradeLevel}
                            >
                                Continue
                            </Button>
                        </HStack>
                    </Fade>
                )}
                {levelCleared && <Spacer />}
            </VStack>
        </Flex>
    );
}
