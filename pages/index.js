import Button from '../components/Button';

function HomePage() {
	return (
		<section className='bg-purple font-montserrat flex flex-col items-center'>
			<div className='min-h-screen flex flex-col items-center justify-evenly'>
				<h1
					id='topElement'
					className='text-2xl text-orange font-openSans font-bold'>
					Hash-2-Win
				</h1>
				<img src='/images/heroImg.svg' alt='Hero Image' width={450} />
				<p className='font-medium text-white'>
					Quiz, Commit, Reveal, and Win - Join our fair and transparent quiz
					platform today!
				</p>
				<div className='flex justify-between w-72'>
					<Button text={'View Quizzes'} link={'quizzes'} />
					<Button text={'Take a Quiz'} link={'create'} />
				</div>
			</div>
			<div className='flex flex-col justify-evenly items-center text-center text-white w-3/5 min-h-screen '>
				<p>
					Welcome to our platform! We are thrilled to introduce you to an
					innovative way to conduct quizzes and reward the deserving
					participants.
				</p>
				<p>
					Our platform is designed to use the commit-reveal scheme, which
					ensures fair and transparent results. In this scheme, players are
					required to submit a hash of their answers along with their address.
					This ensures that no one can cheat or modify their answers later on.
				</p>
				<p>
					Once all the players have submitted their hashes, the answers are
					revealed, and the system checks the submitted hashes to verify the
					correctness of the answers. This method ensures that the deserving
					players are rewarded and eliminates any chances of fraud or cheating.
				</p>
				<p>
					Our commitment to fairness and transparency is what sets us apart from
					other quiz platforms. We believe in providing a level playing field
					for all participants, and the commit-reveal scheme is just one of the
					many ways we achieve this.
				</p>
				<p>
					So, if you're looking for a platform where your knowledge and skills
					are valued and rewarded, you've come to the right place. Join us today
					and be a part of a community that values integrity, fairness, and
					excellence.
				</p>
				<div className='cursor-pointer bg-orange font-bold text-purple px-3 py-2 rounded-3xl'>
					<a href='#topElement'>Go back to top</a>
				</div>
			</div>
		</section>
	);
}

export default HomePage;
