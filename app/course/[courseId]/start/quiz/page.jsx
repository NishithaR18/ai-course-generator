'use client';

import React, { useState, useEffect } from 'react';
import { eq } from 'drizzle-orm';
import { db } from '@/configs/db';
import { Chapters, CourseList } from '@/configs/schema';

export default function QuizPage({ params }) {
  const { courseId } = params;

  const [loading, setLoading] = useState(true);
  const [courseName, setCourseName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const courseData = await fetchCourseData(courseId);
        if (!courseData) {
          console.error('Course not found');
          setLoading(false);
          return;
        }

        setCourseName(courseData.name);

        const generatedQuestions = await generateQuizQuestions(courseId, courseData);
        setQuestions(generatedQuestions);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }

    fetchData();
  }, [courseId]);

  async function fetchCourseData(courseId) {
    const course = await db.select().from(CourseList).where(eq(CourseList.courseId, courseId)).limit(1);
    return course.length > 0 ? course[0] : null;
  }

  // Helper function to shuffle array
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Helper function to create quiz question
  function createQuizQuestion(questionText, correctAnswer, wrongAnswers) {
    const allOptions = [correctAnswer, ...wrongAnswers];
    const shuffledOptions = shuffleArray(allOptions);
    const correctAnswerIndex = shuffledOptions.indexOf(correctAnswer);

    return {
      question: questionText,
      options: shuffledOptions,
      correctAnswerIndex: correctAnswerIndex
    };
  }

  // Enhanced function to create realistic wrong answers based on topic
  function generateRealisticWrongAnswers(correctAnswer, topic, questionType = 'general') {
    const wrongAnswers = [];
    
    // Topic-specific wrong answer generators
    const topicWrongAnswers = {
      'diabetes': [
        'High blood pressure leads to decreased insulin sensitivity',
        'Excessive carb intake directly causes pancreatic failure',
        'Sugar consumption is the primary cause of all diabetes types',
        'Insulin resistance primarily affects the liver only',
        'Type 1 diabetes can be prevented through diet modification',
        'Glucose monitoring is only necessary for severe cases',
        'Exercise has minimal impact on blood sugar control'
      ],
      'c++': [
        'Variables must be declared at the beginning of main() function',
        'C++ automatically manages all memory allocation and deallocation',
        'All functions in C++ must return a value',
        'Header files are optional in modern C++ programming',
        'The << operator can only be used with cout statements',
        'C++ variables are automatically initialized to zero',
        'Function overloading is not supported in standard C++'
      ],
      'programming': [
        'All programming languages use the same syntax rules',
        'Variables can only store one type of data permanently',
        'Functions must always return the same data type they receive',
        'Loop conditions are evaluated only once at the beginning',
        'Arrays automatically resize when elements are added',
        'Object-oriented programming is required for all applications',
        'Debugging tools are built into every programming language'
      ],
      'health': [
        'Symptoms always appear immediately after exposure to risk factors',
        'Generic medications are less effective than brand-name versions',
        'All health conditions have visible external symptoms',
        'Treatment effectiveness is the same for all patients',
        'Prevention methods work universally for all age groups',
        'Medical tests are 100% accurate in all cases',
        'Lifestyle changes show immediate health improvements'
      ]
    };

    // Sentence modification techniques for realistic alternatives
    function createAlternativeAnswers(originalAnswer) {
      const alternatives = [];
      const sentence = originalAnswer.toLowerCase();
      
      // Change key terms to create plausible but wrong statements
      if (sentence.includes('increases')) {
        alternatives.push(originalAnswer.replace(/increases/gi, 'decreases'));
      }
      if (sentence.includes('decreases')) {
        alternatives.push(originalAnswer.replace(/decreases/gi, 'increases'));
      }
      if (sentence.includes('helps') || sentence.includes('improves')) {
        alternatives.push(originalAnswer.replace(/helps|improves/gi, 'worsens'));
      }
      if (sentence.includes('reduces') || sentence.includes('lowers')) {
        alternatives.push(originalAnswer.replace(/reduces|lowers/gi, 'raises'));
      }
      if (sentence.includes('prevents')) {
        alternatives.push(originalAnswer.replace(/prevents/gi, 'causes'));
      }
      if (sentence.includes('essential') || sentence.includes('important')) {
        alternatives.push(originalAnswer.replace(/essential|important/gi, 'optional'));
      }
      if (sentence.includes('before')) {
        alternatives.push(originalAnswer.replace(/before/gi, 'after'));
      }
      if (sentence.includes('daily')) {
        alternatives.push(originalAnswer.replace(/daily/gi, 'weekly'));
      }
      
      return alternatives;
    }

    // Determine topic category
    const topicLower = topic.toLowerCase();
    let relevantWrongAnswers = [];
    
    if (topicLower.includes('diabetes') || topicLower.includes('blood')) {
      relevantWrongAnswers = topicWrongAnswers.diabetes;
    } else if (topicLower.includes('c++') || topicLower.includes('programming')) {
      relevantWrongAnswers = topicWrongAnswers['c++'].concat(topicWrongAnswers.programming);
    } else if (topicLower.includes('health') || topicLower.includes('medical')) {
      relevantWrongAnswers = topicWrongAnswers.health;
    } else {
      // Generic wrong answers
      relevantWrongAnswers = [
        'This concept is not supported by current research',
        'Recent studies have shown this to be ineffective',
        'This approach has been replaced by newer methodologies',
        'Evidence suggests the opposite effect is more common',
        'This principle applies only in theoretical scenarios',
        'Modern practices have moved away from this concept',
        'This statement lacks sufficient scientific backing'
      ];
    }

    // First, try to create modified versions of the correct answer
    const modifiedAnswers = createAlternativeAnswers(correctAnswer);
    wrongAnswers.push(...modifiedAnswers.slice(0, 2));

    // Fill remaining slots with topic-relevant wrong answers
    const shuffledWrongAnswers = shuffleArray(relevantWrongAnswers);
    const remainingSlots = 3 - wrongAnswers.length;
    
    for (let i = 0; i < remainingSlots && i < shuffledWrongAnswers.length; i++) {
      wrongAnswers.push(shuffledWrongAnswers[i]);
    }

    // Ensure we have exactly 3 wrong answers
    while (wrongAnswers.length < 3) {
      wrongAnswers.push('This information is not covered in the current curriculum');
    }

    return wrongAnswers.slice(0, 3);
  }

  // Helper function to extract meaningful content from explanations
  function extractKeyPoints(explanation, topic) {
    // Extract first meaningful sentence
    const sentences = explanation.split('.').filter(s => s.trim().length > 20);
    const firstSentence = sentences[0] ? sentences[0].trim() + '.' : '';
    
    // Extract bullet points if they exist
    const bulletPoints = [];
    if (explanation.includes('* **')) {
      const bullets = explanation.split('* **').slice(1);
      bullets.forEach(bullet => {
        const title = bullet.split(':**')[0];
        const content = bullet.split(':**')[1];
        if (title && content) {
          bulletPoints.push({
            title: title.trim(),
            content: content.split('*')[0].trim()
          });
        }
      });
    }
    
    return { firstSentence, bulletPoints };
  }

  async function generateQuizQuestions(courseId, courseData) {
    const quizQuestions = [];

    // Fetch all chapters for this course
    const chapters = await db.select().from(Chapters).where(eq(Chapters.courseId, courseId));

    // Process chapter content based on the structure you provided
    for (const chapter of chapters) {
      try {
        let chapterContent;
        
        // Parse chapter content
        if (typeof chapter.content === 'string') {
          chapterContent = JSON.parse(chapter.content);
        } else {
          chapterContent = chapter.content;
        }

        // Handle the structure from your examples
        if (chapterContent && chapterContent.details && Array.isArray(chapterContent.details)) {
          // This handles the structure like your Diabetes and C++ examples
          const topic = chapterContent.topic || 'Unknown Topic';
          const chapterTitle = chapterContent.chapter || 'Chapter';

          // Create questions from each detail section
          chapterContent.details.forEach((detail, index) => {
            if (detail.title && detail.explanation) {
              const keyPoints = extractKeyPoints(detail.explanation, topic);
              
              // Question 1: Definition/concept question
              if (keyPoints.firstSentence) {
                const realisticWrongAnswers = generateRealisticWrongAnswers(
                  keyPoints.firstSentence, 
                  topic, 
                  'definition'
                );
                
                const definitionQuestion = createQuizQuestion(
                  `According to the course content, what is "${detail.title}"?`,
                  keyPoints.firstSentence,
                  realisticWrongAnswers
                );
                quizQuestions.push(definitionQuestion);
              }

              // Question 2: Bullet point questions (for content with bullet points)
              if (keyPoints.bulletPoints.length > 0) {
                keyPoints.bulletPoints.forEach(bullet => {
                  if (bullet.content && bullet.content.length > 30) {
                    const bulletAnswer = bullet.content.split('.')[0] + '.';
                    const realisticWrongAnswers = generateRealisticWrongAnswers(
                      bulletAnswer, 
                      topic, 
                      'bullet'
                    );
                    
                    const bulletQuestion = createQuizQuestion(
                      `What is true about ${bullet.title} in ${topic}?`,
                      bulletAnswer,
                      realisticWrongAnswers
                    );
                    quizQuestions.push(bulletQuestion);
                  }
                });
              }

              // Question 3: Multiple choice from explanation content
              if (detail.explanation.includes('include') || detail.explanation.includes('involves') || detail.explanation.includes('consists of')) {
                const sentences = detail.explanation.split('.').filter(s => s.trim().length > 30);
                if (sentences.length >= 2) {
                  // Pick a factual sentence
                  const factualSentence = sentences.find(s => 
                    s.includes('include') || s.includes('involves') || s.includes('consists of') || 
                    s.includes('requires') || s.includes('provides') || s.includes('helps')
                  );
                  
                  if (factualSentence) {
                    const correctAnswer = factualSentence.trim() + '.';
                    const realisticWrongAnswers = generateRealisticWrongAnswers(
                      correctAnswer, 
                      topic, 
                      'factual'
                    );
                    
                    const factQuestion = createQuizQuestion(
                      `Which statement about "${detail.title}" is correct?`,
                      correctAnswer,
                      realisticWrongAnswers
                    );
                    quizQuestions.push(factQuestion);
                  }
                }
              }

              // Question 4: Code-related questions (for programming content)
              if (detail.codeExample && topic.toLowerCase().includes('c++')) {
                const correctAnswer = `It demonstrates ${detail.title.toLowerCase()} in C++ programming`;
                const codeWrongAnswers = [
                  `It shows deprecated C++ syntax that should be avoided`,
                  `It demonstrates a common C++ programming error`,
                  `It illustrates inefficient memory usage in C++`
                ];
                
                const codeQuestion = createQuizQuestion(
                  `In C++, what does the following demonstrate: "${detail.title}"?`,
                  correctAnswer,
                  codeWrongAnswers
                );
                quizQuestions.push(codeQuestion);
              }
            }
          });
        }
        // Handle other potential structures
        else if (chapterContent.title) {
          // Fallback for simpler chapter structures
          const correctAnswer = `The correct understanding of ${chapterContent.title}`;
          const genericWrongAnswers = [
            `A theoretical concept not practically applicable`,
            `An outdated approach superseded by modern methods`,
            `A specialized technique for advanced practitioners only`
          ];
          
          const genericQuestion = createQuizQuestion(
            `What is the main focus of "${chapterContent.title}"?`,
            correctAnswer,
            genericWrongAnswers
          );
          quizQuestions.push(genericQuestion);
        }

      } catch (e) {
        console.error(`Failed to parse chapter content for chapter ${chapter.chapterId}:`, e);
        
        // Create a basic question even if parsing fails
        const otherCategories = ['Health & Fitness', 'Programming', 'Creative', 'Business', 'Science', 'Arts'];
        const wrongCategories = otherCategories.filter(cat => cat !== courseData.category).slice(0, 3);
        
        const fallbackQuestion = createQuizQuestion(
          `This chapter is part of which course?`,
          courseData.name,
          wrongCategories.length >= 3 ? wrongCategories : [
            'Advanced Data Structures',
            'Digital Marketing Fundamentals', 
            'Creative Writing Workshop'
          ]
        );
        quizQuestions.push(fallbackQuestion);
      }
    }

    // If no questions were generated from chapters, create course-level questions
    if (quizQuestions.length === 0) {
      // Course category question
      const categoryOptions = ['Health & Fitness', 'Programming', 'Creative', 'Business', 'Science'];
      const wrongCategories = categoryOptions.filter(cat => cat !== courseData.category).slice(0, 3);
      
      quizQuestions.push(createQuizQuestion(
        `What category does the "${courseData.name}" course belong to?`,
        courseData.category,
        wrongCategories
      ));

      // Course level question
      const levelOptions = ['Beginner', 'Intermediate', 'Advanced'];
      const wrongLevels = levelOptions.filter(level => level !== courseData.level).slice(0, 3);
      
      // Pad with additional realistic options if needed
      if (wrongLevels.length < 3) {
        wrongLevels.push('Expert', 'Foundation', 'Professional');
      }
      
      quizQuestions.push(createQuizQuestion(
        `What skill level is the "${courseData.name}" course designed for?`,
        courseData.level,
        wrongLevels.slice(0, 3)
      ));

      // Video inclusion question
      const videoWrongAnswers = courseData.includeVideo === 'Yes' 
        ? ['No', 'Partially', 'Audio only'] 
        : ['Yes', 'Partially', 'Audio only'];
        
      quizQuestions.push(createQuizQuestion(
        `Does the "${courseData.name}" course include video content?`,
        courseData.includeVideo,
        videoWrongAnswers
      ));
    }

    // Limit to reasonable number of questions and shuffle
    const maxQuestions = Math.min(10, quizQuestions.length);
    return shuffleArray(quizQuestions).slice(0, maxQuestions);
  }

  const handleAnswerSelect = (optionIndex) => {
    if (!showFeedback) {
      setSelectedAnswer(optionIndex);
    }
  };

  const checkAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const correct = selectedAnswer === currentQuestion.correctAnswerIndex;

    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(prevScore => prevScore + 1);
    }

    setUserAnswers([...userAnswers, {
      questionIndex: currentQuestionIndex,
      selectedOption: selectedAnswer,
      isCorrect: correct
    }]);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowResults(false);
    setUserAnswers([]);
    setScore(0);
    // Re-shuffle questions for retake
    setQuestions(shuffleArray(questions));
  };

  if (loading) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading quiz questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{courseName || 'Course'}</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">No quiz questions are available for this course yet.</p>
          <p className="text-sm text-yellow-600 mt-2">Please check back later or contact your instructor.</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Quiz Results</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <p className="text-2xl font-semibold text-blue-800 mb-2">
              {score} / {questions.length}
            </p>
            <p className="text-lg text-blue-600">
              {percentage}% Score
            </p>
            <p className="text-sm text-blue-500 mt-2">
              {percentage >= 80 ? 'Excellent work!' : 
               percentage >= 60 ? 'Good job!' : 
               'Keep studying and try again!'}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Question Review:</h3>
          <div className="space-y-4">
            {userAnswers.map((answer, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 ${
                answer.isCorrect 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className="font-medium text-gray-800 mb-2">
                  {index + 1}. {questions[answer.questionIndex].question}
                </p>
                <p className={`text-sm mb-1 ${
                  answer.isCorrect ? 'text-green-700' : 'text-red-700'
                }`}>
                  Your answer: {questions[answer.questionIndex].options[answer.selectedOption]}
                  {answer.isCorrect ? ' ✓' : ' ✗'}
                </p>
                {!answer.isCorrect && (
                  <p className="text-sm text-green-700 font-medium">
                    Correct answer: {questions[answer.questionIndex].options[questions[answer.questionIndex].correctAnswerIndex]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center space-x-4">
          <button
            onClick={resetQuiz}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Retake Quiz
          </button>
          <button
            onClick={() => {
              // Navigate back to course content
              const currentPath = window.location.pathname;
              // Remove '/quiz' from the end of the path
              const coursePath = currentPath.replace('/quiz', '');
              window.location.href = coursePath;
            }}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{courseName} - Quiz</h2>
          <button
            onClick={() => {
              const currentPath = window.location.pathname;
              const coursePath = currentPath.replace('/quiz', '');
              window.location.href = coursePath;
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
          >
            ← Back to Course
          </button>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>Score: {score}/{currentQuestionIndex + (showFeedback ? 1 : 0)}</span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="font-semibold mb-6 text-lg text-gray-800">
          {currentQuestion.question}
        </h3>

        <ul className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <li key={index}>
              <button
                onClick={() => handleAnswerSelect(index)}
                disabled={showFeedback}
                className={`w-full text-left px-4 py-3 border-2 rounded-lg transition-all duration-200 
                  ${selectedAnswer === index 
                    ? showFeedback
                      ? index === currentQuestion.correctAnswerIndex
                        ? 'bg-green-100 border-green-400 text-green-800' 
                        : 'bg-red-100 border-red-400 text-red-800'
                      : 'bg-blue-100 border-blue-400 text-blue-800'
                    : showFeedback && index === currentQuestion.correctAnswerIndex
                      ? 'bg-green-100 border-green-400 text-green-800'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  } ${showFeedback ? 'cursor-default' : 'cursor-pointer'}
                `}
              >
                <div className="flex justify-between items-center">
                  <span>{option}</span>
                  {showFeedback && (
                    <span className="text-lg">
                      {index === currentQuestion.correctAnswerIndex ? '✓' : 
                       selectedAnswer === index && selectedAnswer !== currentQuestion.correctAnswerIndex ? '✗' : ''}
                    </span>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {!showFeedback ? (
        <button
          onClick={checkAnswer}
          disabled={selectedAnswer === null}
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors font-medium"
        >
          Check Answer
        </button>
      ) : (
        <div>
          <div className={`mb-6 p-4 rounded-lg ${
            isCorrect ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
          }`}>
            <p className={`font-semibold text-lg mb-2 ${
              isCorrect ? 'text-green-800' : 'text-red-800'
            }`}>
              {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
            </p>
            {!isCorrect && (
              <p className="text-red-700">
                The correct answer is: <strong>{currentQuestion.options[currentQuestion.correctAnswerIndex]}</strong>
              </p>
            )}
          </div>

          <button
            onClick={handleNext}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            {currentQuestionIndex === questions.length - 1 ? 'See Results' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
}