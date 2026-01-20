// Course data
const courses = [
    {
        id: 1,
        title: "Basic Greetings",
        icon: "👋",
        label: "START",
        content: {
            title: "Basic Greetings",
            description: "Learn how to greet people and introduce yourself in Japanese.",
            lessons: [
                {
                    title: "Lesson 1: Hello and Goodbye",
                    content: "Learn the basic greetings: こんにちは (konnichiwa - hello), さようなら (sayounara - goodbye), おはよう (ohayou - good morning), and こんばんは (konbanwa - good evening)."
                },
                {
                    title: "Lesson 2: Introducing Yourself",
                    content: "Practice introducing yourself: はじめまして (hajimemashite - nice to meet you), わたしは...です (watashi wa...desu - I am...), and よろしくお願いします (yoroshiku onegaishimasu - pleased to meet you)."
                },
                {
                    title: "Lesson 3: Common Phrases",
                    content: "Master common phrases: ありがとう (arigatou - thank you), すみません (sumimasen - excuse me/sorry), お願いします (onegaishimasu - please), and どういたしまして (douitashimashite - you're welcome)."
                }
            ]
        }
    },
    {
        id: 2,
        title: "Numbers and Counting",
        icon: "🔢",
        label: "LESSON",
        content: {
            title: "Numbers and Counting",
            description: "Master Japanese numbers from 1 to 100 and learn how to count objects.",
            lessons: [
                {
                    title: "Lesson 1: Numbers 1-10",
                    content: "Learn the basic numbers: 一 (ichi - 1), 二 (ni - 2), 三 (san - 3), 四 (yon/shi - 4), 五 (go - 5), 六 (roku - 6), 七 (nana/shichi - 7), 八 (hachi - 8), 九 (kyuu - 9), 十 (juu - 10)."
                },
                {
                    title: "Lesson 2: Numbers 11-100",
                    content: "Learn larger numbers: 十一 (juuichi - 11), 二十 (nijuu - 20), 三十 (sanjuu - 30), and so on. Practice counting up to 百 (hyaku - 100)."
                },
                {
                    title: "Lesson 3: Counting Objects",
                    content: "Learn counters for different objects: 一つ (hitotsu - one thing), 二つ (futatsu - two things), 三つ (mittsu - three things), and the general counter 個 (ko)."
                }
            ]
        }
    },
    {
        id: 3,
        title: "Family Members",
        icon: "👨‍👩‍👧‍👦",
        label: "LESSON",
        content: {
            title: "Family Members",
            description: "Learn vocabulary for family members and how to talk about your family.",
            lessons: [
                {
                    title: "Lesson 1: Immediate Family",
                    content: "Learn: 父 (chichi - father), 母 (haha - mother), 兄 (ani - older brother), 姉 (ane - older sister), 弟 (otouto - younger brother), 妹 (imouto - younger sister)."
                },
                {
                    title: "Lesson 2: Extended Family",
                    content: "Learn: おじいさん (ojiisan - grandfather), おばあさん (obaasan - grandmother), おじさん (ojisan - uncle), おばさん (obasan - aunt), いとこ (itoko - cousin)."
                },
                {
                    title: "Lesson 3: Talking About Family",
                    content: "Practice sentences like: これは私の家族です (kore wa watashi no kazoku desu - This is my family), and learn how to describe family relationships."
                }
            ]
        }
    },
    {
        id: 4,
        title: "Food and Drinks",
        icon: "🍱",
        label: "LESSON",
        content: {
            title: "Food and Drinks",
            description: "Learn vocabulary for common foods and drinks, and how to order at a restaurant.",
            lessons: [
                {
                    title: "Lesson 1: Common Foods",
                    content: "Learn: ご飯 (gohan - rice/meal), パン (pan - bread), 肉 (niku - meat), 魚 (sakana - fish), 野菜 (yasai - vegetables), 果物 (kudamono - fruit)."
                },
                {
                    title: "Lesson 2: Drinks",
                    content: "Learn: 水 (mizu - water), お茶 (ocha - tea), コーヒー (koohii - coffee), ジュース (juusu - juice), ビール (biiru - beer), 酒 (sake - sake/alcohol)."
                },
                {
                    title: "Lesson 3: Ordering Food",
                    content: "Practice phrases: これをください (kore o kudasai - I'll have this), お願いします (onegaishimasu - please), お会計 (okaikei - check/bill), and いただきます (itadakimasu - said before eating)."
                }
            ]
        }
    },
    {
        id: 5,
        title: "Daily Activities",
        icon: "⭐",
        label: "STAR",
        content: {
            title: "Daily Activities",
            description: "Learn how to talk about your daily routine and activities.",
            lessons: [
                {
                    title: "Lesson 1: Morning Routine",
                    content: "Learn: 起きる (okiru - to wake up), 歯を磨く (ha o migaku - to brush teeth), シャワーを浴びる (shawaa o abiru - to take a shower), 朝ごはんを食べる (asagohan o taberu - to eat breakfast)."
                },
                {
                    title: "Lesson 2: Work and School",
                    content: "Learn: 働く (hataraku - to work), 勉強する (benkyou suru - to study), 学校に行く (gakkou ni iku - to go to school), 会社 (kaisha - company)."
                },
                {
                    title: "Lesson 3: Evening Activities",
                    content: "Learn: 帰る (kaeru - to return home), 晩ごはんを食べる (bangohan o taberu - to eat dinner), テレビを見る (terebi o miru - to watch TV), 寝る (neru - to sleep)."
                }
            ]
        }
    },
    {
        id: 6,
        title: "Practice Session",
        icon: "💪",
        label: "PRACTICE",
        content: {
            title: "Practice Session",
            description: "Review and practice what you've learned so far with interactive exercises.",
            lessons: [
                {
                    title: "Exercise 1: Vocabulary Review",
                    content: "Review all the vocabulary words from previous lessons. Practice matching Japanese words with their English meanings."
                },
                {
                    title: "Exercise 2: Sentence Building",
                    content: "Practice building sentences using the grammar patterns you've learned. Combine words to form complete sentences."
                },
                {
                    title: "Exercise 3: Listening Practice",
                    content: "Listen to native speakers and practice your listening comprehension. Try to understand the main points of conversations."
                }
            ]
        }
    },
    {
        id: 7,
        title: "Time and Dates",
        icon: "📅",
        label: "LESSON",
        content: {
            title: "Time and Dates",
            description: "Learn how to tell time, talk about dates, and schedule appointments.",
            lessons: [
                {
                    title: "Lesson 1: Telling Time",
                    content: "Learn: 時 (ji - hour), 分 (fun - minute), 今何時ですか (ima nanji desu ka - what time is it now?), 午前 (gozen - AM), 午後 (gogo - PM)."
                },
                {
                    title: "Lesson 2: Days of the Week",
                    content: "Learn: 月曜日 (getsuyoubi - Monday), 火曜日 (kayoubi - Tuesday), 水曜日 (suiyoubi - Wednesday), 木曜日 (mokuyoubi - Thursday), 金曜日 (kin'youbi - Friday), 土曜日 (doyoubi - Saturday), 日曜日 (nichiyoubi - Sunday)."
                },
                {
                    title: "Lesson 3: Months and Dates",
                    content: "Learn: 月 (gatsu - month), 日 (nichi - day), 年 (nen - year), and how to say dates like 2024年3月15日 (March 15, 2024)."
                }
            ]
        }
    },
    {
        id: 8,
        title: "Treasure Chest",
        icon: "💎",
        label: "REWARD",
        content: {
            title: "Congratulations!",
            description: "You've completed this section! Here's your reward.",
            lessons: [
                {
                    title: "Achievement Unlocked",
                    content: "🎉 Great job! You've completed all the lessons in this section. You've earned 50 XP and unlocked new content!"
                },
                {
                    title: "What's Next?",
                    content: "Continue to the next section to learn more advanced topics. Keep up the great work!"
                }
            ]
        }
    }
];

// Initialize the learning path
function initializeLearningPath() {
    const learningPath = document.getElementById('learningPath');
    
    courses.forEach((course, index) => {
        const courseBtn = document.createElement('button');
        courseBtn.className = 'course-btn';
        courseBtn.id = `course-${course.id}`;
        
        // First course is active, others are locked
        if (index === 0) {
            courseBtn.classList.add('active');
        } else if (index > 0) {
            courseBtn.classList.add('locked');
        }
        
        courseBtn.innerHTML = `
            <span class="course-icon">${course.icon}</span>
            <span class="course-label">${course.label}</span>
        `;
        
        // Add click event
        courseBtn.addEventListener('click', () => {
            if (!courseBtn.classList.contains('locked')) {
                showCourseContent(course);
            }
        });
        
        learningPath.appendChild(courseBtn);
    });
}

// Show course content
function showCourseContent(course) {
    const courseContent = document.getElementById('courseContent');
    const courseDetails = document.getElementById('courseDetails');
    
    // Build the content HTML
    let contentHTML = `
        <h2>${course.content.title}</h2>
        <p>${course.content.description}</p>
    `;
    
    course.content.lessons.forEach((lesson, index) => {
        contentHTML += `
            <div class="lesson-item">
                <h4>${lesson.title}</h4>
                <p>${lesson.content}</p>
            </div>
        `;
    });
    
    courseDetails.innerHTML = contentHTML;
    
    // Show the content area
    courseContent.classList.add('show');
    
    // Scroll to the course content
    courseContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Close course content
function closeCourseContent() {
    const courseContent = document.getElementById('courseContent');
    courseContent.classList.remove('show');
    
    // Scroll back to top of learning path
    document.querySelector('.learning-path-container').scrollIntoView({ behavior: 'smooth' });
}

// Unlock next course when current is completed
function unlockNextCourse(currentIndex) {
    if (currentIndex < courses.length - 1) {
        const nextCourseBtn = document.getElementById(`course-${courses[currentIndex + 1].id}`);
        if (nextCourseBtn) {
            nextCourseBtn.classList.remove('locked');
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeLearningPath();
    
    // Close button event
    document.getElementById('closeBtn').addEventListener('click', closeCourseContent);
    
    // Mark first course as completed and unlock next (for demo)
    // In a real app, this would be triggered by completing lessons
    setTimeout(() => {
        const firstCourse = document.getElementById('course-1');
        if (firstCourse) {
            firstCourse.classList.remove('active');
            unlockNextCourse(0);
        }
    }, 2000);
});

// Smooth scrolling for the page
document.addEventListener('DOMContentLoaded', () => {
    // Enable smooth scrolling for the entire page
    document.documentElement.style.scrollBehavior = 'smooth';
});
